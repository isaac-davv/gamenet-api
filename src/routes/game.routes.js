const router = require('express').Router()
const {
  getJuegos,
  getJuego,
  crearJuego,
  editarJuego,
  eliminarJuego
} = require('../controllers/game.controller')
const { isAuthenticated } = require('../middleware/auth.middleware')
const { isAdmin } = require('../middleware/roles.middleware')
const { upload } = require('../middleware/upload.middleware')

// Públicas — cualquiera puede ver los juegos
router.get('/', getJuegos)
router.get('/:id', getJuego)

// Solo admin — gestión del catálogo
router.post('/', isAuthenticated, isAdmin, upload.single('coverImage'), crearJuego)
router.put('/:id', isAuthenticated, isAdmin, upload.single('coverImage'), editarJuego)
router.delete('/:id', isAuthenticated, isAdmin, eliminarJuego)

module.exports = router