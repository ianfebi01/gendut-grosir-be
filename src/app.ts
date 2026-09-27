import express from 'express'
import session from 'express-session'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { env } from './config'
import { routers } from './routes'

export const createApp = () => {
  const app = express()

  app.use(express.json())
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: 'SECRET',
    })
  )
  app.use(
    cors({
      credentials: true,
      origin: env.ALLOW_CORS?.split(' '),
    })
  )
  app.use(fileUpload({ useTempFiles: true }))

  routers.forEach((router) => app.use('/', router))

  return app
}
