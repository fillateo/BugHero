const express = require('express')

const router = express.Router()
const { isAuthenticated } = require('../middleware/auth')

const controller = require('../controllers/issues')

// @desc    Create new issues
// @route   GET /issues/:projectId/new
router.get('/:projectId/new', isAuthenticated, controller.new)

// @desc    Store issue
// @route   POST /issues/projectId
router.post('/:projectId', isAuthenticated, controller.store)

// @desc    Show issue details
// @route   GET /issues/:projectId/details/:id
router.get('/:projectId/details/:id/:page', isAuthenticated, controller.details)

// @desc    Edit issue
// @route   GET /issues/:projectId/edit/:id
router.get('/:projectId/edit/:id', isAuthenticated, controller.edit)

// @desc    Update issue
// @route   PUT /issues/:projectId/:id
router.put('/:projectId/:id', isAuthenticated, controller.update)

module.exports = router
