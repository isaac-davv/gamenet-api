const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Conectado a MongoDB')

    const csvPath = path.join(__dirname, './data/users.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    const users = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    await User.deleteMany({})
    console.log('🗑️  Colección Users limpiada')

    // Encriptamos cada contraseña manualmente porque insertMany
    // no ejecuta el hook pre('save') del modelo
    const usersFormateados = await Promise.all(
      users.map(async (user) => ({
        username: user.username,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl || '',
        readyPlayerMeUrl: user.readyPlayerMeUrl || ''
      }))
    )

    await User.insertMany(usersFormateados)
    console.log(`👤 ${usersFormateados.length} usuarios insertados correctamente`)

  } catch (error) {
    console.error('❌ Error en la seed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Conexión cerrada')
  }
}

runSeed()