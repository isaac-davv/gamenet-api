const Game = require('../models/Game.model')

// ─── GET JUEGOS ──────────────────────────────────────────────
const getJuegos = async (req, res) => {
  try {
    const { genre, platform, search, page = 1, limit = 20 } = req.query

    // Construimos el filtro dinámicamente según los query params
    const filtro = {}

    if (genre) {
      filtro.genre = { $regex: genre, $options: 'i' }
    }

    if (platform) {
      filtro.platform = { $regex: platform, $options: 'i' }
    }

    if (search) {
      filtro.title = { $regex: search, $options: 'i' }
    }

    // Paginación
    const skip = (Number(page) - 1) * Number(limit)
    const total = await Game.countDocuments(filtro)

    const juegos = await Game.find(filtro)
      .sort({ rating: -1 })   // ordenados por rating de mayor a menor
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json({
      juegos,
      total,
      pagina: Number(page),
      totalPaginas: Math.ceil(total / Number(limit))
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los juegos', error: error.message })
  }
}

// ─── GET JUEGO ───────────────────────────────────────────────
const getJuego = async (req, res) => {
  try {
    const juego = await Game.findById(req.params.id)

    if (!juego) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }

    res.status(200).json(juego)

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el juego', error: error.message })
  }
}

// ─── CREAR JUEGO (admin) ─────────────────────────────────────
const crearJuego = async (req, res) => {
  try {
    const { title, genre, platform, year, developer, rating, description } = req.body

    const juegoExiste = await Game.findOne({ title })
    if (juegoExiste) {
      return res.status(400).json({ message: 'Ya existe un juego con ese título' })
    }

    // Busca la imagen en RAWG automáticamente
    let coverImage = ''
    try {
      const rawgRes = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(title)}&page_size=1`
      )
      const rawgData = await rawgRes.json()
      if (rawgData.results?.length > 0) {
        coverImage = rawgData.results[0].background_image || ''
      }
    } catch {
      console.log('No se pudo obtener imagen de RAWG')
    }

    const nuevoJuego = await Game.create({
      title, genre, platform, year,
      developer, rating, description,
      coverImage: req.file ? req.file.path : coverImage
    })

    res.status(201).json({
      message: 'Juego creado correctamente',
      juego: nuevoJuego
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al crear el juego', error: error.message })
  }
}
// ─── EDITAR JUEGO (admin) ────────────────────────────────────
const editarJuego = async (req, res) => {
  try {
    const { title, genre, platform, year, developer, rating, description } = req.body

    const datosActualizados = {
      title,
      genre,
      platform,
      year,
      developer,
      rating,
      description
    }

    // Solo actualizamos la imagen si se sube una nueva
    if (req.file) {
      datosActualizados.coverImage = req.file.path
    }

    const juegoActualizado = await Game.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    )

    if (!juegoActualizado) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }

    res.status(200).json({
      message: 'Juego actualizado correctamente',
      juego: juegoActualizado
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al editar el juego', error: error.message })
  }
}

// ─── ELIMINAR JUEGO (admin) ──────────────────────────────────
const eliminarJuego = async (req, res) => {
  try {
    const juego = await Game.findByIdAndDelete(req.params.id)

    if (!juego) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }

    res.status(200).json({ message: 'Juego eliminado correctamente' })

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el juego', error: error.message })
  }
}

module.exports = {
  getJuegos,
  getJuego,
  crearJuego,
  editarJuego,
  eliminarJuego
}