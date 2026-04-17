const express = require('express');
const cors = require('cors');
const {connectDB} = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes')
const userRoutes = require('./src/routes/user.routes')
const gameRoutes = require('./src/routes/game.routes')
const postRoutes = require('./src/routes/post.routes')

const app = express()

// Conexión a la base de datos
connectDB()

// Middlewares globales
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gamenet-client.vercel.app'
  ]
}))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/posts', postRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🎮 GameNet API funcionando correctamente' })
})

module.exports = app