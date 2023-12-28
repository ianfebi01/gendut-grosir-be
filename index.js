const express = require('express')
const mongoose = require('mongoose')
const { readdirSync, readFileSync, writeFileSync } = require('fs')
const session = require('express-session')
const cors = require('cors')
const dotenv = require('dotenv')
const User = require('./models/User')
const fileUpload = require('express-fileupload')
const Role = require('./models/Role')
const { postDefaultRole } = require('./controllers/role')

dotenv.config()

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 8000

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
    origin: process.env.ALLOW_CORS?.split(' '),
  })
)
app.use(
  fileUpload({
    useTempFiles: true,
  })
)

// Database
mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log('Connection error : ' + err))

// Routes
readdirSync('./routes').map((item) => app.use('/', require('./routes/' + item)))

app.listen(PORT, () => console.log('listening on port', PORT))
