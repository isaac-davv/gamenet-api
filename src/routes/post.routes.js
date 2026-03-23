const router = require('express').Router()
const {
  getPosts,
  getPost,
  crearPost,
  editarPost,
  eliminarPost,
  darLike
} = require('../controllers/post.controller')
const { isAuthenticated } = require('../middleware/auth.middleware')
const { isAdmin } = require('../middleware/roles.middleware')
const { upload } = require('../middleware/upload.middleware')

// Públicas
router.get('/', getPosts)
router.get('/:id', getPost)

// Protegidas
router.post('/', isAuthenticated, upload.single('image'), crearPost)
router.put('/:id', isAuthenticated, upload.single('image'), editarPost)
router.post('/:id/like', isAuthenticated, darLike)

// Admin o autor del post
router.delete('/:id', isAuthenticated, eliminarPost)

module.exports = router