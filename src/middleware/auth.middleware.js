const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Comprobamos que viene el header Authorization
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No hay token.' })
    }

    // 2. Verificamos que el token es válido y no ha expirado
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. Buscamos el usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'Token inválido. Usuario no encontrado.' })
    }

    // 4. Guardamos el usuario en req para usarlo en los controladores
    req.user = user
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' })
  }
}

module.exports = { isAuthenticated }