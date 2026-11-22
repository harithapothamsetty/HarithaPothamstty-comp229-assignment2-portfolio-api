import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import config from './config/config.js'
import portfolioApp from './server/express.js'

const app = express()

mongoose.Promise = global.Promise

let databaseConnectionPromise

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  if (!config.mongoUri) {
    throw new Error('Missing MONGODB_URI environment variable.')
  }

  if (!config.jwtSecret) {
    throw new Error('Missing JWT_SECRET environment variable.')
  }

  if (!databaseConnectionPromise) {
    databaseConnectionPromise = mongoose
      .connect(config.mongoUri, {
        serverSelectionTimeoutMS: 10000
      })
      .catch((error) => {
        databaseConnectionPromise = undefined
        throw error
      })
  }

  await databaseConnectionPromise
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'portfolio-backend'
  })
})

app.use(async (req, res, next) => {
  try {
    await connectDatabase()
    next()
  } catch (error) {
    console.error(
      'Database initialization failed:',
      error.name || 'Unknown error'
    )

    res.status(503).json({
      error: 'Backend database connection is unavailable.'
    })
  }
})

app.use(portfolioApp)

if (!process.env.VERCEL) {
  async function startLocalServer() {
    try {
      await connectDatabase()

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
    } catch (error) {
      console.error(
        'Unable to start server:',
        error.name || 'Unknown error'
      )
      process.exit(1)
    }
  }

  startLocalServer()
}

export default app