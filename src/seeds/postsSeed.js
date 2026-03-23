const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const mongoose = require('mongoose')
const Post = require('../models/Post.model')
const User = require('../models/User.model')
const Game = require('../models/Game.model')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Conectado a MongoDB')

    const csvPath = path.join(__dirname, './data/posts.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    const posts = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    await Post.deleteMany({})
    console.log('🗑️  Colección Posts limpiada')

    // Para cada post buscamos el _id del usuario y del juego
    // usando los datos del CSV (username y title)
    const postsFormateados = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findOne({ username: post.author_username })
        const game = await Game.findOne({ title: post.game_title })

        // Si no encuentra el usuario o el juego, lo saltamos
        if (!user || !game) {
          console.warn(`⚠️  No se encontró usuario o juego para el post: "${post.content.slice(0, 40)}..."`)
          return null
        }

        return {
          author: user._id,
          game: game._id,
          content: post.content,
          imageUrl: post.imageUrl || '',
          likes: []
        }
      })
    )

    // Filtramos los posts nulos (los que no encontraron usuario o juego)
    const postsValidos = postsFormateados.filter((post) => post !== null)

    await Post.insertMany(postsValidos)
    console.log(`📝 ${postsValidos.length} posts insertados correctamente`)

  } catch (error) {
    console.error('❌ Error en la seed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Conexión cerrada')
  }
}

runSeed()