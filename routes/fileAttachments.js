const express = require('express')
const { isAuthenticated } = require('../middleware/auth')

const upload = require('../middleware/upload')

const controller = require('../controllers/fileAttachments')

const router = express.Router()

// @desc    upload project file attachment
// @route   GET /issueattachments/:projectId/new
router.post(
  '/:projectId/',
  isAuthenticated,
  upload.single('file'),
  controller.upload
)

// @desc    Download project file attachment
// @route   GET /issueattachments/?file=blqbla
router.get('/', isAuthenticated, controller.download)

// @desc    Delete project file attachment
// @route   DELETE /issueattachments/:id
router.delete('/:id', isAuthenticated, controller.delete)

module.exports = router
