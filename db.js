const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new SQLite database connection
const db = new sqlite3.Database(path.join(__dirname, 'my-database.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');

        // Create the tables if they do not exist
        db.serialize(() => {
            // Create the blogs table with the createdBy column
            db.run(`CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                createdBy INTEGER,
                coverImageURL TEXT,
                FOREIGN KEY (createdBy) REFERENCES users(id)
            )`, (err) => {
                if (err) {
                    console.error('Error creating blogs table:', err.message);
                } else {
                    console.log('Blogs table created or already exists');
                }
            });

            // Create the users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullName TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                } else {
                    console.log('Users table created or already exists');
                }
            });

            // Create the comments table
            db.run(`CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                blogId INTEGER,
                content TEXT NOT NULL,
                createdBy INTEGER,
                FOREIGN KEY (blogId) REFERENCES blogs(id),
                FOREIGN KEY (createdBy) REFERENCES users(id)
            )`, (err) => {
                if (err) {
                    console.error('Error creating comments table:', err.message);
                } else {
                    console.log('Comments table created or already exists');
                }
            });
        });
    }
});

// Export the database object
module.exports = db;
