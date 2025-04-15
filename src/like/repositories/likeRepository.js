const Like = require('../models/like'); // Adjust the path as necessary
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Create a like
const createLike = async (likeData) => await Like.create(likeData);

// Delete a like
const deleteLike = async (likeId) => await Like.findByIdAndDelete(likeId);

// Delete likes by postId and userId
const deleteLikeByPostAndUser = async ({ likeId, postId, userId }) => {
  return await Like.findOneAndDelete({ _id: likeId, post: postId, user: userId });
};


// Delete likes by commentId
const deleteLikesByComment = async (commentId) => {
  return await Like.deleteMany({ comment: commentId });
};

// Find a like by user, post, and comment
const findLikeByUser = async ({ user, post, comment }) => {
  const query = { user };

  if (post) {
    query.post = post;
  }

  if (comment) {
    query.comment = comment;
  }

  return await Like.findOne(query);
};

// Get likes for a specific post
const getLikesByPost = async (postId) => await Like.find({ post: postId }).populate('user', 'username');

// Get likes for a specific comment
const getLikesByComment = async (commentId) => await Like.find({ comment: commentId }).populate('user', 'username');

// Get likes by a specific user
const getLikesByUser = async (userId) => await Like.find({ user: userId }).populate('post comment');

module.exports = {
  createLike,
  deleteLike,
  deleteLikeByPostAndUser,
  deleteLikesByComment,
  getLikesByPost,
  getLikesByComment,
  getLikesByUser,
  findLikeByUser,
};