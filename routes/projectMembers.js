const express = require('express')
const { isAuthenticated } = require('../middleware/auth')
const controller = require('../controllers/projectMembers')

const router = express.Router()

// @desc    add project members
// @route   GET /:projectId/new/:page
router.get('/:projectId/new/:page', isAuthenticated, controller.user)

// @desc    Update project members
// @route   PUT /projectmembers/:projectId
router.put('/:projectId', isAuthenticated, controller.add)

// @desc    Delete project members
// @route   PUT /projectmembers/:projectId/delete
router.put('/:projectId/delete', isAuthenticated, controller.remove)

module.exports = router
