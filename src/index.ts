import { env } from './config'
import mongoose from 'mongoose'
import { createApp } from './app'
import { seedRoles } from './seeders/roles'

mongoose.set('strictQuery', false)
mongoose
  .connect(env.DATABASE_URL)
  .then(async () => {
    console.log('Connected to database')
    const created = await seedRoles()
    if (created.length) console.log('Seeded roles:', created.join(', '))
  })
  .catch((err) => console.log('Connection error : ' + err))

const app = createApp()

app.listen(env.PORT, () => console.log('listening on port', env.PORT))

// Vercel's @vercel/node runtime imports the app as the default export.
export default app
