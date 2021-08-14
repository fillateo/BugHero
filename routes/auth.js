const express = require('express')
const controller = require('../controllers/auth')

const router = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', controller.google)

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', controller.googleCallback, controller.redirect)

// @desc    Logout
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
