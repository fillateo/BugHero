const express = require('express')
const {
  isAuthenticated,
  redirectIfAuthenticated,
} = require('../middleware/auth')
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

// @desc    View user profile
// @route   GET /users/:id
router.get('/:id', isAuthenticated, controller.profile)

// @desc    Edit user
// @route   GET /users/:id/edit
router.get('/:id/edit', isAuthenticated, controller.edit)

// @desc    Update user
// @route   post /users/:id
router.put('/:id', isAuthenticated, controller.update)

module.exports = router
