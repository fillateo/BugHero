const express = require('express')
// Middleware
const { redirectIfAuthenticated } = require('../middleware/auth')
// Controllers
const controller = require('../controllers/users')

const router = express.Router()

// @desc    Login
// @route   GET /users/login
router.get('/login', redirectIfAuthenticated, controller.login)

// @desc    Process Login
// @route   POST /users/login
router.post('/login', controller.processLogin)

// @desc    Register
// @route   GET /users/register
router.get('/register', redirectIfAuthenticated, controller.register)

// @desc    Store/Create New User
// @route   POST /users/register
router.post('/register', controller.create)

module.exports = router