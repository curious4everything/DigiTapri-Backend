const likeRepository = require('../repositories/likeRepository');


// Create a like
const createLike = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const { post, comment } = req.body;

    // Ensure either post or comment is provided
    if (!post && !comment) {
      return res.status(400).json({ error: 'A like must be associated with either a post or a comment.' });
    }

    // Check if a like already exists for the user and post/comment
    const existingLike = await likeRepository.findLikeByUser({ user: userId, post, comment });
    if (existingLike) {
      return res.status(400).json({ error: 'You have already liked this post/comment.' });
    }

    const like = await likeRepository.createLike({ user: userId, post, comment });
    res.status(201).json(like);
  } catch (error) {
    console.error('Error creating like:', error);
    res.status(500).json({ error: 'Failed to create like.' });
  }
};

// Delete a like
const deleteLike = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await likeRepository.deleteLike(id);

    if (!like) {
      return res.status(404).json({ error: 'Like not found.' });
    }
0
    res.status(200).json({ message: 'Like deleted successfully.' });
  } catch (error) {
    console.error('Error deleting like:', error);
    res.status(500).json({ error: 'Failed to delete like.' });
  }
};

//Delete likes by postId
const deleteLikeByPostAndUser = async (req, res) => {
  try {
    const { postId, likeId } = req.params;
    const userId = req.user.id; // Extract user ID from authenticated request

    // Find and delete the like with the specified likeId, postId, and userId
    const like = await likeRepository.deleteLikeByPostAndUser({ likeId, postId, userId });

    if (!like) {
      return res.status(404).json({ error: 'Like not found for the given post, user, or like ID.' });
    }

    res.status(200).json({ message: 'Like deleted successfully.' });
  } catch (error) {
    console.error('Error deleting like by post and user:', error);
    res.status(500).json({ error: 'Failed to delete like by post and user.' });
  }
};

// Delete likes by commentId
const deleteLikesByComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const result = await likeRepository.deleteLikesByComment(commentId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No likes found for the given comment.' });
    }

    res.status(200).json({ message: 'Likes deleted successfully.', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting likes by comment:', error);
    res.status(500).json({ error: 'Failed to delete likes by comment.' });
  }
};

// Get likes for a specific post
const getLikesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await likeRepository.getLikesByPost(postId);
    res.status(200).json(likes);
  } catch (error) {
    console.error('Error fetching likes for post:', error);
    res.status(500).json({ error: 'Failed to fetch likes for post.' });
  }
};

// Get likes for a specific comment
const getLikesByComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const likes = await likeRepository.getLikesByComment(commentId);
    res.status(200).json(likes);
  } catch (error) {
    console.error('Error fetching likes for comment:', error);
    res.status(500).json({ error: 'Failed to fetch likes for comment.' });
  }
};

// Get likes by a specific user
const getLikesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await likeRepository.getLikesByUser(userId);
    res.status(200).json(likes);
  } catch (error) {
    console.error('Error fetching likes by user:', error);
    res.status(500).json({ error: 'Failed to fetch likes by user.' });
  }
};

module.exports = {
  createLike,
  deleteLike,
  deleteLikeByPostAndUser ,
  deleteLikesByComment,
  getLikesByPost,
  getLikesByComment,
  getLikesByUser,
};