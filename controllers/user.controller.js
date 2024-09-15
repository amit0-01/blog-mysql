const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');


const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if the email already exists
        const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
        db.get(checkUserQuery, [email], async (err, row) => {
            if (err) {
                console.error("Error checking email:", err);
                return res.status(500).send("Server error");
            }

            if (row) {
                // Email already exists
                return res.status(400).send("Email already exists");
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('hashed password', hashedPassword);

            // Insert new user into the database
            const query = `INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)`;

            db.run(query, [fullName, email, hashedPassword], function (err) {
                if (err) {
                    console.error("Error creating user:", err);
                    return res.status(500).send("Server error");
                }

                // User created successfully, redirect or send a success response
                return res.status(201).send("User created successfully");
            });
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Server error");
    }
};
const signin = async (req, res) => {
    const { email, password } = req.body;

    // SQL query to find the user by email
    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], async function (err, user) {
        if (err || !user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '1h' });

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return res.status(200).json({
            success: true,
            message: "Sign in successful",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email
            },
            token: token
        });
    });
};


module.exports = {
    signup,
    signin
};