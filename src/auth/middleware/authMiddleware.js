// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

const protect = async (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log("Token received from header:", token); //debugging line

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); //debugging line

            // Get user from the token.
            // **Important Change:** Use 'decoded.userId' instead of 'decoded.id'
            req.user = await User.findById(decoded.userId).select('-password');
            console.log("User from token:", req.user); //debugging line

            if (!req.user) {
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }

            next(); // Call the next middleware
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

module.exports = { protect };