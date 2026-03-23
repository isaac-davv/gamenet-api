const router = require('express').Router()
const { register, login, getMe } = require('../controllers/auth.controller')
const { isAuthenticated } = require('../middleware/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.get('/me', isAuthenticated, getMe)

module.exports = router