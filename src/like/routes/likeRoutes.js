const express = require('express');
const likeController = require('../controllers/likeController'); // Ensure this is the correct path to your controller
const { protect } = require('../../auth/middleware/authMiddleware'); // Ensure this is the correct path to your auth middleware

const router = express.Router();

// Create a like (requires authentication)
router.post('/', protect, likeController.createLike);

// Delete a like by its ID (requires authentication)
router.delete('/:id', protect, likeController.deleteLike);

// Delete a like by postId and userId (requires authentication)
router.delete('/post/:postId/like/:likeId', protect, likeController.deleteLikeByPostAndUser);

// Delete all likes for a specific comment (requires authentication)
router.delete('/comment/:commentId', protect, likeController.deleteLikesByComment);

// Get likes for a specific post (requires authentication)
router.get('/post/:postId', protect, likeController.getLikesByPost);

// Get likes for a specific comment (requires authentication)
router.get('/comment/:commentId', protect, likeController.getLikesByComment);

// Get all likes by a specific user (requires authentication)
router.get('/user/:userId', protect, likeController.getLikesByUser);


module.exports = router;
