const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        // Get token from cookies
        const tokenCookieValue = req.cookies[cookieName];

        // Get token from Authorization header
        const tokenHeaderValue = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer <token>'

        // Use the token from header if present, otherwise use the token from cookies
        const token = tokenHeaderValue || tokenCookieValue;

        if (!token) {
            console.log('No token found, proceeding without setting req.user');
            return next();
        }

        try {
            // Validate the token and set req.user
            const userPayload = validateToken(token);
            req.user = userPayload;
            console.log('Token is valid, userPayload:', userPayload);
        } catch (error) {
            console.log('Token validation failed:', error.message);
            // Optionally handle the error if needed
        }

        // Proceed to the next middleware or route handler
        next();
    };
}

module.exports = {
    checkForAuthenticationCookie
};
