const User = require('../models/User.model')
const jwt = require('jsonwebtoken')

//REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Comprobamos que no exista ya el usuario o el email
    const usernameExiste = await User.findOne({ username })
    if (usernameExiste) {
      return res.status(400).json({ message: 'Ese nombre de usuario ya está en uso' })
    }

    const emailExiste = await User.findOne({ email })
    if (emailExiste) {
      return res.status(400).json({ message: 'Ese email ya está registrado' })
    }

    const nuevoUsuario = await User.create({ username, email, password })

    // Generamos el token JWT
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        _id: nuevoUsuario._id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role,
        bio: nuevoUsuario.bio,
        avatarUrl: nuevoUsuario.avatarUrl
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message })
  }
}

//LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    const passwordCorrecta = await user.comparePassword(password)
    if (!passwordCorrecta) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Login correcto',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message })
  }
}

//GET ME
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'username avatarUrl')
      .populate('following', 'username avatarUrl')

    res.status(200).json(user)

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message })
  }
}

module.exports = { register, login, getMe }