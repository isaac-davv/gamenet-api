const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      unique: true,
      trim: true
    },
    genre: {
      type: String,
      required: [true, 'El género es obligatorio'],
      trim: true
    },
    platform: {
      type: String,
      required: [true, 'La plataforma es obligatoria'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'El año es obligatorio'],
      min: [1970, 'El año no puede ser anterior a 1970'],
      max: [new Date().getFullYear(), 'El año no puede ser futuro']
    },
    developer: {
      type: String,
      required: [true, 'El desarrollador es obligatorio'],
      trim: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    coverImage: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Game', gameSchema)