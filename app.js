const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');  // Add this line

const app = express();

// Enable CORS with specific options (or allow all origins)
app.use(cors({
    origin: '*', // Replace '*' with specific origin if needed, e.g., 'https://yourfrontenddomain.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify which headers are allowed
}));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files (for serving uploaded files)
app.use(express.static(path.join(__dirname, 'public')));

// Session handling (if needed)
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
}));

// Routes
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
app.use('/blog', blogRouter);
app.use('/user', userRouter);
    
// Error handling for 404 (Not Found)
app.use(function(req, res, next) {
    res.status(404).json({
        message: 'Not Found',
        error: 'The requested resource was not found on this server'
    });
});

// General error handling middleware
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

// Set the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
