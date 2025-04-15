// models/Follow.js
const mongoose = require('mongoose');
const followSchema = new mongoose.Schema(
    {
      follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  // Static method to unfollow a user
  followSchema.statics.unfollow = async function (followerId, followingId) {
    return await this.deleteOne({ follower: followerId, following: followingId });
  };
  
  const Follow = mongoose.model('Follow', followSchema);
  module.exports = Follow;