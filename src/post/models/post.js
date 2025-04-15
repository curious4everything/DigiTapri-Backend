const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      media: {
        type: String,
        default: '',
      },
      visibility: {
        type: String,
        enum: ['public', 'private'], // Only 'public' or 'private' values allowed
        default: 'public', // Default to 'public' if not specified
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      }],
    },
    {
      timestamps: true,
    }
  );

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
