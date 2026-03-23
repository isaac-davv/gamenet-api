const router = require('express').Router()
const {
  getUsuario,
  editarPerfil,
  subirAvatar,
  seguirUsuario,
  dejarDeSeguir,
  eliminarCuenta
} = require('../controllers/user.controller')
const { isAuthenticated } = require('../middleware/auth.middleware')
const { isAdmin } = require('../middleware/roles.middleware')
const { upload } = require('../middleware/upload.middleware')

// Pública — ver perfil de cualquier usuario
router.get('/:username', getUsuario)

// Protegidas — requieren estar logueado
router.put('/perfil/editar', isAuthenticated, editarPerfil)
router.post('/perfil/avatar', isAuthenticated, upload.single('avatar'), subirAvatar)
router.post('/:id/seguir', isAuthenticated, seguirUsuario)
router.post('/:id/dejardeseguir', isAuthenticated, dejarDeSeguir)

// Admin — solo administradores
router.delete('/:id', isAuthenticated, isAdmin, eliminarCuenta)

module.exports = router