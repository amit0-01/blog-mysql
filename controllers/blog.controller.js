const db = require('../db')
const { promisify } = require('util'); 

// GET ALL BLOGS
const getAll = (req, res) => {
    db.all('SELECT * FROM blogs', [], (err, rows) => {
        if ('eeror',err) {
            console.error(err);  
            return res.status(500).send("Server error");
        }

        return res.json(rows); 
    });
};


const addBlog = async (req, res) => {
    const { title, content } = req.body;

    // Check if the file exists
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'File not uploaded'
        });
    }

    // Assuming your uploads folder is accessible via an endpoint like '/uploads'
    // Get the base URL dynamically (in development, it would be something like 'http://localhost:3000')
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const coverImageURL = `${baseURL}/uploads/${req.file.filename}`;

    console.log('coverImageURL', coverImageURL);

    // Insert the blog post into the database
    db.run('INSERT INTO blogs (title, content, createdBy, coverImageURL) VALUES (?, ?, ?, ?)', 
        [title, content, coverImageURL], function (err) {
            if (err) {
                console.error('Error inserting blog:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Server error'
                });
            }

            // Retrieve the newly inserted blog post details
            const newBlogId = this.lastID;
            db.get('SELECT * FROM blogs WHERE id = ?', [newBlogId], (err, blog) => {
                if (err) {
                    console.error('Error retrieving blog:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Server error'
                    });
                }

                // Retrieve user details
                db.get('SELECT * FROM users WHERE id = ?', [blog.createdBy], (err, user) => {
                    if (err) {
                        console.error('Error retrieving user:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Server error'
                        });
                    }

                    // Send a success response with the blog and user information
                    return res.status(201).json({
                        success: true,
                        message: 'Blog created successfully',
                        blog: {
                            ...blog,
                            coverImageURL, // Send the full URL to the frontend
                        }
                    });
                });
            });
        });
};



const getBlogById = async(req, res) => {
    const blogId = req.params.id;

    // Query to get the blog post
    db.get('SELECT * FROM blogs WHERE id = ?', [blogId], (err, blog) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Query to get comments related to the blog post
        db.all('SELECT * FROM comments WHERE blogId = ?', [blogId], (err, comments) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Server error" });
            }

            // Send JSON response with blog and comments
            return res.json({
                success: true,
                blog,
                comments
            });
        });
    });
}
const dbRun = promisify(db.run.bind(db));

const commentBlog = async (req, res) => {
    const { blogId } = req.params;
    const { content } = req.body;

    try {
        await dbRun('INSERT INTO comments (content, blogId, createdBy) VALUES (?, ?, ?)', [content, blogId, req.user.id]);
        return res.redirect(`/blog/${blogId}`);
    } catch (err) {
        console.error('Error inserting comment:', err);
        return res.status(500).send("Server error");
    }
};

const dbGet = promisify(db.get.bind(db));

const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure the blog exists
        const blog = await dbGet('SELECT * FROM blogs WHERE id = ?', [id]);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        // Delete the blog
        await dbRun('DELETE FROM blogs WHERE id = ?', [id]);

        // Optionally, you might want to delete related comments if necessary
        await dbRun('DELETE FROM comments WHERE blogId = ?', [id]);

        return res.status(200).send("Blog deleted successfully");
    } catch (err) {
        console.error('Error deleting blog:', err);
        return res.status(500).send("Server error");
    }
};



module.exports = {getAll, addBlog, getBlogById, commentBlog, deleteBlog};
