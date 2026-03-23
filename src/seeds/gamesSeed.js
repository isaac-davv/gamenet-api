const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const mongoose = require('mongoose')
const Game = require('../models/Game.model')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const runSeed = async () => {
  try {
    // 1. Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Conectado a MongoDB')

    // 2. Leer el CSV con fs
    const csvPath = path.join(__dirname, './data/games.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    // 3. Convertir el CSV en un array de objetos
    const games = parse(csvContent, {
      columns: true,        // usa la primera fila como nombres de campo
      skip_empty_lines: true,
      trim: true
    })

    // 4. Limpiar la colección antes de insertar
    await Game.deleteMany({})
    console.log('🗑️  Colección Games limpiada')

    // 5. Transformar y guardar cada juego
    const gamesFormateados = games.map((game) => ({
      title: game.title,
      genre: game.genre,
      platform: game.platform,
      year: Number(game.year),
      developer: game.developer,
      rating: parseFloat(game.rating.replace(',', '.')) || 0,
      coverImage: game.coverImage,
      description: game.description
    }))

    await Game.insertMany(gamesFormateados)
    console.log(`🎮 ${gamesFormateados.length} juegos insertados correctamente`)

  } catch (error) {
    console.error('❌ Error en la seed:', error.message)
  } finally {
    // 6. Cerrar la conexión siempre, haya error o no
    await mongoose.disconnect()
    console.log('🔌 Conexión cerrada')
  }
}

runSeed()