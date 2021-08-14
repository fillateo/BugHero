const express = require('express')

const router = express.Router()

const { isAuthenticated } = require('../middleware/auth')

// controllers
const controller = require('../controllers/projects')

// @desc    Show add project page
// @route   GET /projects/new
router.get('/new', isAuthenticated, controller.new)

// @desc    Store project
// @route   POST /projects
router.post('/', isAuthenticated, controller.store)

// @desc    Show all projects
// @route   GET /projects/:page
router.get('/:page', isAuthenticated, controller.showAll)

// @desc    Show project details
// @route   GET /projects/details/:id
router.get('/details/:id', isAuthenticated, controller.details)

// @desc    Edit project
// @route   GET /projects/edit/:id
router.get('/edit/:id', isAuthenticated, controller.edit)

// @desc    Update project
// @route   PUT /projects/:id
router.put('/:id', isAuthenticated, controller.update)

// @desc    Delete project
// @route   DELETE /projects/:id
router.delete('/:id', isAuthenticated, controller.remove)

module.exports = router
