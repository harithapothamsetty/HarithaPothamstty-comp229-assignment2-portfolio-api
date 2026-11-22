import 'dotenv/config'
import mongoose from 'mongoose'
import config from './config/config.js'
import app from './server/express.js'

mongoose.Promise = global.Promise

async function startServer() {
  if (!config.mongoUri) {
    console.error('Missing MONGODB_URI environment variable.')
    process.exit(1)
  }

  if (!config.jwtSecret) {
    console.error('Missing JWT_SECRET environment variable.')
    process.exit(1)
  }

  try {
    await mongoose.connect(config.mongoUri)
    console.log('Connected to the database!')
  } catch {
    console.error(
      'Unable to connect to the database. Check the database configuration and network access.'
    )
    process.exit(1)
  }

  const server = app.listen(
    config.port,
    '0.0.0.0',
    () => {
      console.log(
        'Server started on port %s.',
        config.port
      )
    }
  )

  server.on('error', (error) => {
    console.error(
      'Server failed to start:',
      error.code || 'Unknown server error'
    )
    process.exit(1)
  })
}

startServer()