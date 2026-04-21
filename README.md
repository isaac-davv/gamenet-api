# 🎮 GameNet API

Backend REST para GameNet, una red social para gamers. Desarrollado como proyecto final del bootcamp fullstack de The Rock Code.

## 🚀 Demo

- **API en producción:** https://gamenet-api.onrender.com
- **Frontend:** https://gamenet-client.vercel.app

## 🛠️ Stack tecnológico

- **Node.js + Express** — Servidor y API REST
- **MongoDB + Mongoose** — Base de datos NoSQL
- **JWT** — Autenticación con tokens
- **bcryptjs** — Encriptación de contraseñas
- **Cloudinary + Multer** — Subida de imágenes
- **csv-parse** — Lectura de CSVs para seeds
- **Zod** — Validación de esquemas
- **RAWG API** — Imágenes automáticas de videojuegos

## 📁 Estructura del proyecto

```
gamenet-api/
├── src/
│   ├── config/          → Conexión MongoDB y Cloudinary
│   ├── middleware/       → Auth, roles y upload
│   ├── models/          → User, Game, Post
│   ├── routes/          → Rutas de la API
│   ├── controllers/     → Lógica de negocio
│   └── seeds/           → Scripts de población de BD
│       └── data/        → CSVs con datos iniciales
├── app.js
└── index.js
```

## 🗄️ Modelos de datos

### User
```json
{
  "username": "string",
  "email": "string",
  "password": "string (bcrypt)",
  "role": "user | admin",
  "bio": "string",
  "avatarUrl": "string",
  "avatarConfig": "object",
  "followers": ["ObjectId"],
  "following": ["ObjectId"]
}
```

### Game
```json
{
  "title": "string",
  "genre": "string",
  "platform": "string",
  "year": "number",
  "developer": "string",
  "rating": "number",
  "coverImage": "string",
  "description": "string"
}
```

### Post
```json
{
  "author": "ObjectId → User",
  "game": "ObjectId → Game",
  "content": "string",
  "imageUrl": "string",
  "likes": ["ObjectId → User"]
}
```

## 🔐 Endpoints

### Auth
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Pública | Registro |
| POST | /api/auth/login | Pública | Login |
| GET | /api/auth/me | Auth | Mi perfil |

### Usuarios
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | /api/users/:username | Pública | Ver perfil |
| PUT | /api/users/perfil/editar | Auth | Editar perfil |
| POST | /api/users/perfil/avatar | Auth | Subir avatar |
| POST | /api/users/:id/seguir | Auth | Seguir usuario |
| POST | /api/users/:id/dejardeseguir | Auth | Dejar de seguir |
| DELETE | /api/users/:id | Admin | Eliminar usuario |

### Juegos
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | /api/games | Pública | Listar juegos |
| GET | /api/games/:id | Pública | Ver juego |
| POST | /api/games | Admin | Crear juego |
| PUT | /api/games/:id | Admin | Editar juego |
| DELETE | /api/games/:id | Admin | Eliminar juego |

### Posts
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | /api/posts | Pública | Listar posts |
| GET | /api/posts/:id | Pública | Ver post |
| POST | /api/posts | Auth | Crear post |
| PUT | /api/posts/:id | Auth | Editar post |
| DELETE | /api/posts/:id | Auth/Admin | Eliminar post |
| POST | /api/posts/:id/like | Auth | Toggle like |

## 🌱 Seeds

La base de datos se puebla desde archivos CSV usando `fs` de Node.js:

```bash
npm run seed:games   # 105 videojuegos reales
npm run seed:users   # 10 usuarios de ejemplo
npm run seed:posts   # 20 posts de ejemplo
```

## ⚙️ Variables de entorno

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAWG_API_KEY=
```

## 🚀 Instalación local

```bash
# Clona el repositorio
git clone https://github.com/isaac-davv/gamenet-api.git
cd gamenet-api

# Instala dependencias
npm install

# Configura las variables de entorno
cp .env.example .env

# Ejecuta las seeds
npm run seed:games
npm run seed:users
npm run seed:posts

# Arranca el servidor
npm run dev
```