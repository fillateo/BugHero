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

// @desc    Register
// @route   GET /users/register
router.get('/register', redirectIfAuthenticated, controller.register)

// @desc    View user profile
// @route   GET /users/:id
router.get('/:id', isAuthenticated, controller.profile)

// @desc    Edit user
// @route   GET /users/:id/edit
router.get('/:id/edit', isAuthenticated, controller.edit)

// @desc    Update user
// @route   post /users/:id
router.put('/:id', isAuthenticated, controller.update)

// @desc    Delete user
// @route   DELETE /users/:id
router.delete('/:id', isAuthenticated, controller.remove)

module.exports = router
