const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El autor es obligatorio']
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'El juego es obligatorio']
    },
    content: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      maxlength: [500, 'El post no puede superar los 500 caracteres']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Post', postSchema)

