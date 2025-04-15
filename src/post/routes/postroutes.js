// routes/postroutes.js
const express = require('express');
const router = express.Router();
const { 
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost,
    createMultiplePosts,
    getFeedPosts,
    deleteMultiplePosts 
} = require('../controllers/postController');
const { protect } = require('../../auth/middleware/authMiddleware');

router.post('/', protect, createPost); //creates posts - API route-POST api/posts (input- post body)
router.get('/', getAllPosts); //gets requested posts with id - API route-GET api/posts (no input)
router.get('/feed', protect, getFeedPosts); //creates posts - API route-POST api/posts/feed (no input)
router.get('/:id', getPostById);// gets perticular requested post - API route-GET api/posts/postid (no input)
router.put('/:id', protect, updatePost);//updates perticular post- - API route-PUT api/posts/postid (input- updated post body)
router.delete('/:id', protect, deletePost); //deletes perticular post- API route-DELETE api/posts/postid (no input)
router.post('/bulk-create', protect, createMultiplePosts); //Create multiple posts -API route-POST api/posts/bulk-create (input - Array of posts body)
/*router.delete('/bulk-delete', protect,(req, res, next) => {
    console.log("🚀 Route hit: DELETE /bulk-delete");
    console.log("🔹 Request body:", req.body);
    next();
}, deleteMultiplePosts); //Delete multiple posts - API route-DELETE api/posts/postid/bulk-delete (input- Array of post id)*/

module.exports = router;