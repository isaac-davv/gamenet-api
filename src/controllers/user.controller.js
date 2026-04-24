const User = require('../models/User.model')

//  GET USUARIO 
const getUsuario = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username avatarUrl')
      .populate('following', 'username avatarUrl')

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(user)

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
  }
}

//  EDITAR PERFIL 
const editarPerfil = async (req, res) => {
  try {
    const { bio, avatarConfig } = req.body

    const usuarioActualizado = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatarConfig },
      { new: true, runValidators: true }
    ).select('-password')

    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: usuarioActualizado
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al editar el perfil', error: error.message })
  }
}

//  SUBIR AVATAR 
const subirAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' })
    }

    const usuarioActualizado = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: req.file.path },
      { new: true }
    ).select('-password')

    res.status(200).json({
      message: 'Avatar actualizado correctamente',
      user: usuarioActualizado
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al subir el avatar', error: error.message })
  }
}

//  SEGUIR USUARIO 
const seguirUsuario = async (req, res) => {
  try {
    const usuarioAseguir = await User.findById(req.params.id)

    if (!usuarioAseguir) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes seguirte a ti mismo' })
    }

    if (usuarioAseguir.followers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Ya sigues a este usuario' })
    }

    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { followers: req.user._id }
    })

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: req.params.id }
    })

    res.status(200).json({ message: `Ahora sigues a ${usuarioAseguir.username}` })

  } catch (error) {
    res.status(500).json({ message: 'Error al seguir usuario', error: error.message })
  }
}

//  DEJAR DE SEGUIR 
const dejarDeSeguir = async (req, res) => {
  try {
    const usuarioAdejarDeSeguir = await User.findById(req.params.id)

    if (!usuarioAdejarDeSeguir) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (!usuarioAdejarDeSeguir.followers.includes(req.user._id)) {
      return res.status(400).json({ message: 'No sigues a este usuario' })
    }

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id }
    })

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id }
    })

    res.status(200).json({ message: `Has dejado de seguir a ${usuarioAdejarDeSeguir.username}` })

  } catch (error) {
    res.status(500).json({ message: 'Error al dejar de seguir', error: error.message })
  }
}

//  ELIMINAR CUENTA 
const eliminarCuenta = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Usuario eliminado correctamente' })

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message })
  }
}

module.exports = {
  getUsuario,
  editarPerfil,
  subirAvatar,
  seguirUsuario,
  dejarDeSeguir,
  eliminarCuenta
}