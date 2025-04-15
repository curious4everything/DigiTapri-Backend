// src/auth/conrollers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const user = new User({
            email,
            username,
            password: password, // Store plain password for validation
        });

        // Trigger Mongoose validation
        await user.validate();

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password with the hashed password
        user.password = hashedPassword;
        
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            res.status(400).json({ error: error.message });
        } else if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // Duplicate email error
            res.status(400).json({ error: 'Email already exists' });
        } else {
            // Other errors
            res.status(500).json({ error: error.message });
        }
    }
};
async function loginUser(req) {
    try {
        const { usernameOrEmail, password } = req.body;
        console.log("Searching for user:", usernameOrEmail);
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
        console.log("User found:", user);

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", passwordMatch);

        if (!passwordMatch) {
            return { success: false, message: 'Password does not match' };
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return { success: true, token };
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, message: 'An error occurred during login' };
    }
}

module.exports = { registerUser, loginUser };