const Post = require('../models/Post.model')

//  GET POSTS 
const getPosts = async (req, res) => {
  try {
    const { game, author, page = 1, limit = 10 } = req.query

    const filtro = {}

    if (game) filtro.game = game
    if (author) filtro.author = author

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Post.countDocuments(filtro)

    const posts = await Post.find(filtro)
      .sort({ createdAt: -1 })  // los más recientes primero
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'username avatarUrl')
      .populate('game', 'title coverImage genre')

    res.status(200).json({
      posts,
      total,
      pagina: Number(page),
      totalPaginas: Math.ceil(total / Number(limit))
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los posts', error: error.message })
  }
}

//  GET POST 
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatarUrl')
      .populate('game', 'title coverImage genre')
      .populate('likes', 'username')

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    res.status(200).json(post)

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el post', error: error.message })
  }
}

//  CREAR POST 
const crearPost = async (req, res) => {
  try {
    const { content, game } = req.body

    const nuevoPost = await Post.create({
      author: req.user._id,
      game,
      content,
      imageUrl: req.file ? req.file.path : ''
    })

    // Populamos antes de devolver para que el frontend
    // tenga todos los datos sin necesitar otra petición
    const postPopulado = await Post.findById(nuevoPost._id)
      .populate('author', 'username avatarUrl')
      .populate('game', 'title coverImage genre')

    res.status(201).json({
      message: 'Post creado correctamente',
      post: postPopulado
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al crear el post', error: error.message })
  }
}

//  EDITAR POST 
const editarPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    // Solo el autor puede editar su post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar este post' })
    }

    const datosActualizados = { content: req.body.content }

    if (req.file) {
      datosActualizados.imageUrl = req.file.path
    }

    const postActualizado = await Post.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    )
      .populate('author', 'username avatarUrl')
      .populate('game', 'title coverImage genre')

    res.status(200).json({
      message: 'Post actualizado correctamente',
      post: postActualizado
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al editar el post', error: error.message })
  }
}

//  ELIMINAR POST 
const eliminarPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    // El autor o un admin pueden eliminar el post
    const esAutor = post.author.toString() === req.user._id.toString()
    const esAdmin = req.user.role === 'admin'

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este post' })
    }

    await Post.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Post eliminado correctamente' })

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el post', error: error.message })
  }
}

//  DAR LIKE 
const darLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    const yaLeGusto = post.likes.includes(req.user._id)

    if (yaLeGusto) {
      // Si ya le dio like, se lo quitamos (toggle)
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user._id }
      })
      return res.status(200).json({ message: 'Like eliminado' })
    }

    // Si no le había dado like, lo añadimos
    await Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user._id }
    })

    res.status(200).json({ message: 'Like añadido' })

  } catch (error) {
    res.status(500).json({ message: 'Error al dar like', error: error.message })
  }
}

module.exports = {
  getPosts,
  getPost,
  crearPost,
  editarPost,
  eliminarPost,
  darLike
}