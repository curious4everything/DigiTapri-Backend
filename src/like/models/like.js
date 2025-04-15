

// models/Like.js
const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: Ensure either `post` or `comment` is provided, but not both
likeSchema.pre('validate', function (next) {
  if (!this.post && !this.comment) {
    return next(new Error('A like must be associated with either a post or a comment.'));
  }
  if (this.post && this.comment) {
    return next(new Error('A like cannot be associated with both a post and a comment.'));
  }
  next();
});

// Cascade Deletion: Remove likes when a post or comment is deleted
likeSchema.pre('remove', async function (next) {
  const Like = this.constructor;

  // If a post is deleted, remove associated likes
  if (this.post) {
    await Like.deleteMany({ post: this.post });
  }

  // If a comment is deleted, remove associated likes
  if (this.comment) {
    await Like.deleteMany({ comment: this.comment });
  }

  next();
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;