const mongoose = require('mongoose');
const User = require('../auth/models/User');
const Post = require('../post/models/post');
const Comment = require('../comment/models/comment');
const Like = require('../like/models/like');
const Follow = require('../follow/models/follow');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/my_social_media', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected...');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();
    await Follow.deleteMany();
    console.log('✅ Existing data cleared.');

    // Create users
    const userData = [
      { email: 'user1@example.com', password: 'password1', username: 'user1', bio: 'Bio of user1' },
      { email: 'user2@example.com', password: 'password2', username: 'user2', bio: 'Bio of user2' },
      { email: 'user3@example.com', password: 'password3', username: 'user3', bio: 'Bio of user3' },
    ];

    const users = await Promise.all(userData.map((data) => User.create(data))); // Use create() to trigger middleware
    console.log('✅ Users created.');

    // Create posts
    const posts = await Post.insertMany([
      { author: users[0]._id, text: 'Post by user1', visibility: 'public' },
      { author: users[1]._id, text: 'Post by user2', visibility: 'private' },
    ]);
    console.log('✅ Posts created.');

    // Create comments
    const comments = await Comment.insertMany([
      { author: users[1]._id, post: posts[0]._id, text: 'Comment by user2 on post1' },
      { author: users[2]._id, post: posts[0]._id, text: 'Comment by user3 on post1' },
    ]);
    console.log('✅ Comments created.');

    // Create likes
    const likes = await Like.insertMany([
      { user: users[0]._id, post: posts[0]._id },
      { user: users[1]._id, comment: comments[0]._id },
    ]);
    console.log('✅ Likes created.');

    // Create follows
    const follows = await Follow.insertMany([
      { follower: users[0]._id, following: users[1]._id },
      { follower: users[1]._id, following: users[2]._id },
    ]);
    console.log('✅ Follows created.');

    console.log('🎉 Database seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();