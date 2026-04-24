const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const mongoose = require('mongoose')
const axios = require('axios')
const Game = require('../models/Game.model')

const API_KEY = process.env.RAWG_API_KEY

const updateCovers = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Conectado a MongoDB')

  const games = await Game.find()

  let actualizados = 0
  let sinImagen = 0

  for (const game of games) {
    try {
      const response = await axios.get('https://api.rawg.io/api/games', {
        params: {
          key: API_KEY,
          search: game.title,
          page_size: 1
        }
      })

      const results = response.data.results

      if (results.length > 0 && results[0].background_image) {
        game.coverImage = results[0].background_image
        await game.save()
        console.log(`✅ ${game.title} → imagen actualizada`)
        actualizados++
      } else {
        console.log(`⚠️  ${game.title} → no encontrado en RAWG`)
        sinImagen++
      }

    } catch (error) {
      console.log(`❌ Error con ${game.title}:`, error.message)
    }
  }

  console.log(`\n🎮 Resumen:`)
  console.log(`   Actualizados: ${actualizados}`)
  console.log(`   Sin imagen:   ${sinImagen}`)

  await mongoose.disconnect()
  console.log('Desconectado. ¡Listo!')
}

updateCovers()