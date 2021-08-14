const express = require('express')
const { isAuthenticated } = require('../middleware/auth')
const controller = require('../controllers/index')

const router = express.Router()

// @desc    Dashboard/Landing page
// @route   GET /
router.get('/', isAuthenticated, controller.index)

// fake project generate
router.get('/generate-fake-project-data', controller.generateFakeProject)

// fake comment generate
router.get('/generate-fake-comment-data', controller.generateFakeComment)

module.exports = router
