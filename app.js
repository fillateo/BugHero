const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const moment = require('moment')
const connectMongoDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectMongoDB()

const app = express()

// send data to ejs
app.use((req, res, next) => {
  res.locals.moment = moment
  res.locals.edit = null
  next()
})

// view engine ejs
app.set('view engine', 'ejs')

// parsing data in json
app.use(bodyParser.json())

// or parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))

// Method override
app.use(
  /*eslint-disable */
  methodOverride( (req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method
      delete req.body._method
      return method
  /* eslint-enable */
    }
  })
)

// static file
app.use(express.static(path.join(__dirname, 'public')))

// view folder
app.set('views', path.join(__dirname, 'views'))

app.use(
  session({
    secret: 'Hello World',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// use morgan for logging if running development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/projects', require('./routes/projects'))
app.use('/issues', require('./routes/issues'))
app.use('/fileattachments', require('./routes/fileAttachments'))
app.use('/comments', require('./routes/comments'))
// render if path not found
app.use((req, res) => {
  res.render('error/404')
})

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
