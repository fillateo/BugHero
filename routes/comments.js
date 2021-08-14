const express = require('express')

const { isAuthenticated } = require('../middleware/auth')

const controller = require('../controllers/comments')

const router = express.Router()

// @desc    Store comment
// @route   POST /comments/:issueId
router.post('/:issueId', isAuthenticated, controller.store)

// @desc    Edit comment
// @route   GET /comments/:id
router.get('/edit/:id', isAuthenticated, controller.edit)

// @desc    Process Update comment
// @route   PUT /comments/id
router.put('/:id', isAuthenticated, controller.update)

// @desc    Delete comment
// @route   DELETE /comments/:issueId/:id
router.delete('/:id', isAuthenticated, controller.delete)

module.exports = router
