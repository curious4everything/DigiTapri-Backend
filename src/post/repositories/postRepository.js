// repositories/postRepository.js
const Post = require('../models/post');
const mongoose = require('mongoose');

console.log("Debugging postRepository.js");

const createPost = async (userId, postData) => {
    return await Post.create({ ...postData, author: userId });
};

const getAllPosts = async () => {
    return await Post.find().populate('author', 'username');
};

const getPostById = async (postId) => {
    return await Post.findById(postId).populate('author', 'username');
};

const updatePost = async (postId, userId, updateData) => {
    return await Post.findOneAndUpdate(
        { _id: postId, author: userId },
        updateData,
        { new: true }
    );
};

const deletePost = async (postId, userId) => {
    const post = await Post.findOne({ _id: postId, author: userId });
    if (!post) return false;
    await post.deleteOne();
    return true;
};

const insertMany = async (userId, posts) => {
    // Ensure each post has the `author` field assigned
    const postsWithAuthor = posts.map((post) => ({
        ...post,
        author: userId, // Assign the current user's ID
    }));

    return await Post.insertMany(postsWithAuthor);
};

// Uncommented and corrected deleteMany function
const deleteMany = async (postIds) => {
    console.log("🔍 Converting postIds to ObjectId:", postIds);

    const objectIds = postIds.map(id => new mongoose.Types.ObjectId(id));
    return await Post.deleteMany({ _id: { $in: objectIds } });
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    insertMany,
    deleteMany
};
