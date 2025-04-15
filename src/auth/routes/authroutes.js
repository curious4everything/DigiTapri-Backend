// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Create a new user with the plain password
        const newUser = new User({ username, email, password });

        // Save the user (middleware in the model will hash the password)
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.username) {
                res.status(400).json({ error: 'Username already exists' });
            } else if (error.keyPattern && error.keyPattern.email) {
                res.status(400).json({ error: 'Email already exists' });
            }
        } else {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'An error occurred during registration' });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Find user by username or email
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Compare passwords using the model method
        const passwordMatch = await user.matchPassword(password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

router.get('/api/profile/:usernameOrEmail', async (req, res) => {
    try {
        const { usernameOrEmail } = req.params;

        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        }).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;