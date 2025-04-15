// controllers/postController.js
const PostRepository = require('../repositories/postRepository');
const Post = require('../models/post');
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
    try {
        console.log("🔹 Received Post Data:", req.body);
        
        const post = await PostRepository.createPost(req.user.id, req.body);

        // ✅ Populate author before sending response
        await post.populate("author", "username");

        console.log("✅ Post Created Successfully:", post); 
        res.status(201).json(post);
    } catch (error) {
        console.error("❌ Error Creating Post:", error.message); 
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostRepository.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFeedPosts = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null; // Get logged-in user ID if available

        const posts = await Post.find({
            $or: [
                { author: userId },  // Fetch ALL posts of the logged-in user
                { visibility: "public", author: { $ne: userId } }  // Fetch ONLY public posts from other users
            ]
        })
        .populate("author", "username")  // Populate author's username
        .sort({ createdAt: -1 }); // Sort by latest first

        res.json(posts);
    } catch (error) {
        console.error("Error fetching feed posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getPostById = async (req, res) => {
    try {
        const post = await PostRepository.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await PostRepository.updatePost(req.params.id, req.user.id, req.body);
        if (!post) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const success = await PostRepository.deletePost(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Create Multiple Posts
exports.createMultiplePosts = async (req, res) => {
    try {
        const { posts } = req.body; // Extract array of posts
        const userId = req.user.id; // Extract userId from decoded token

        if (!posts || !Array.isArray(posts) || posts.length === 0) {
            return res.status(400).json({ error: "Posts array is required and cannot be empty." });
        }

        // Validate each post
        const formattedPosts = posts.map(post => {
            if (!post.text) {
                throw new Error("Text is required for each post.");
            }
            return {
                text: post.text,
                media: post.media || null,
                visibility: post.visibility || "public",
                author: userId, // Assign the current user as the author
            };
        });

        // Insert all posts into the database
        const createdPosts = await Post.insertMany(formattedPosts);

        res.status(201).json({ message: "Posts created successfully", posts: createdPosts });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};
/*//  Delete Multiple Posts
exports.deleteMultiplePosts = async (req, res) => {
    try {
        console.log("🚀 Incoming DELETE request to /bulk-delete");
        console.log("Headers:", req.headers);
        console.log("Received request body:", req.body);

        if (!req.body || !req.body.postIds) {
            console.log("🚨 Missing postIds in request body!");
            return res.status(400).json({ error: "Missing postIds array in request body." });
        }

        const { postIds } = req.body;
        console.log("Extracted postIds:", postIds);

        if (!Array.isArray(postIds) || postIds.length === 0) {
            console.log("🚨 Invalid input - Expected an array.");
            return res.status(400).json({ error: "Invalid input. Expected an array of post IDs." });
        }

        const invalidIds = postIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            console.log("🚨 Invalid ObjectId(s):", invalidIds);
            return res.status(400).json({ error: `Invalid ObjectId(s) found: ${invalidIds.join(", ")}` });
        }

        const deletedPosts = await PostRepository.deleteMany(postIds);

        console.log("🗑️ Deleted posts:", deletedPosts);

        if (deletedPosts.deletedCount === 0) {
            console.log("⚠️ No posts found for deletion.");
            return res.status(404).json({ message: "No posts found for the given IDs." });
        }

        res.status(200).json({ message: "✅ Posts deleted successfully!", deletedCount: deletedPosts.deletedCount });

    } catch (error) {
        console.error("❌ Delete Error:", error);
        res.status(500).json({ error: "Something went wrong while deleting posts." });
    }
};*/