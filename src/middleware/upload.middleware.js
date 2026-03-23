const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gamenet',         // carpeta en tu cuenta de Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, quality: 'auto' }]
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // máximo 5MB
})

module.exports = { upload }