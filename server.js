// server.js
require('dotenv').config({ path: 'E:/Coding/Fullstack/AI_Project/Social_Media_DigiTapri/backend/evar.env' });// Load environment variables from .env
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const PORT = process.env.PORT || 5000;
const authroutes = require('./src/auth/routes/authroutes');
const likeroutes = require('./src/like/routes/likeRoutes');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const protectedRoutes = require('./src/auth/routes/protectedRoutes');
const postRoutes = require('./src/post/routes/postroutes');

connectDB();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`🔥 Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from your frontend's origin
  credentials: true, // ✅ Allow cookies/auth headers
}));

//routes
app.use('/api', authroutes);
app.use('/api/posts', postRoutes);
app.use('/api', protectedRoutes);
app.use('/api/likes', likeroutes); // Add this line to include the like routes

app.get('/', (req, res) => {
  res.send('This is Auth projet server made on Express JS');
});

app.listen(PORT, () => {
    //server change check comments
  console.log(`Server listening on port ${PORT}`);
});