import { env } from './config'
import mongoose from 'mongoose'
import { attachDatabasePool } from '@vercel/functions'
import { createApp } from './app'
import { seedRoles } from './seeders/roles'

mongoose.set('strictQuery', false)
mongoose
  // Close idle pooled connections so suspended serverless instances don't leak them.
  .connect(env.DATABASE_URL, { maxIdleTimeMS: 5000 })
  .then(async () => {
    console.log('Connected to database')
    const created = await seedRoles()
    if (created.length) console.log('Seeded roles:', created.join(', '))
  })
  .catch((err) => console.log('Connection error : ' + err))
// Keeps the Vercel function alive until idle connections are released; no-op elsewhere.
attachDatabasePool(mongoose.connection.getClient())

const app = createApp()

// On Vercel the runtime imports the app as the default export instead.
if (!process.env.VERCEL) {
  app.listen(env.PORT, () => console.log('listening on port', env.PORT))
}

export default app
