const express = require('express')

const { isAuthenticated } = require('../middleware/auth')

const router = express.Router()

const controller = require('../controllers/dashboard')

// @desc    Dashboard/Landing page
// @route   GET /
router.get('/', isAuthenticated, controller.index)

/* eslint-disable no-await-in-loop */
// fake project generate
router.get('/generate-fake-project-data', controller.generateFakeProject)

// fake comment generate
router.get('/generate-fake-comment-data', controller.generateFakeComment)
/* eslint-enable no-await-in-loop */

module.exports = router
