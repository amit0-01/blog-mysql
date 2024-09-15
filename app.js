const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');  

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
}));

const blogRouter = require('./routes/blog');
app.use('/blog', blogRouter);
    
app.use(function(req, res, next) {
    res.status(404).json({
        message: 'Not Found',
        error: 'The requested resource was not found on this server'
    });
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
