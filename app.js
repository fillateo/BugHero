const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const expressValidator = require('express-validator')
// const expressStatusMonitor = require('express-status-monitor')
const compression = require('compression')
const flash = require('express-flash')
const MongoStore = require('connect-mongo')
const moment = require('moment')
const connectMongoDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

connectMongoDB()

const app = express()

// Passport config
require('./config/passport')(passport)

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

// expresss helper packages
// app.use(expressStatusMonitor())

// express-validator
app.use(expressValidator())
app.use(compression())
app.use(flash())

// send data to ejs
app.use((req, res, next) => {
  res.locals.moment = moment
  res.locals.edit = null
  res.locals.active = req.path // [0] will be empty since routes start with '/'
  res.locals.user = req.user
  res.locals.success = req.flash('success')
  next()
})

// view engine ejs
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout', 'layouts/auth')

// parsing data in json
app.use(bodyParser.json())

// parsing application/xwww-
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

// use morgan for logging if running development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/projects', require('./routes/projects'))
app.use('/issues', require('./routes/issues'))
app.use('/fileattachments', require('./routes/fileAttachments'))
app.use('/comments', require('./routes/comments'))
app.use('/projectmembers', require('./routes/projectMembers'))
// render if path not found
app.use((req, res) => {
  res.render('error/404', { layout: 'layouts/layoutError' })
})

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

module.exports = app
