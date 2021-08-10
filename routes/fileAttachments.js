
const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { isAuthenticated } = require('../middleware/auth')
const Project = require('../models/Project')
const FileAttachment = require('../models/FileAttachment')

const router = express.Router()

//set storage engine
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/issueFileAttachments"));

    },
    filename: function (req, file, cb) {
      cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)

        );

    },

});

const upload = multer({ storage: diskStorage })

// @desc    upload project file attachment
// @route   GET /issueattachments/:projectId/new
router.post('/:projectId/', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    const file = req.file.path
    if (!file) {
      res.render('error/400')
    }

    req.body.project = await Project.findById(req.params.projectId)
    req.body.user = req.user
    req.body.file = file
    await FileAttachment.create(req.body)

    res.redirect(`/projects/details/${req.params.projectId}`)

  } catch (error) {
    console.log(error)
    res.render('error/500')
  }

})

// @desc    Download project file attachment
// @route   GET /issueattachments/?file=blqbla
router.get('/', isAuthenticated, async (req, res) => {
  try {
    res.download(req.query.file)
  } catch (err) {
    conslole.log(err)
    res.render('error/500')
  }
})

// @desc    Delete project file attachment
// @route   DELETE /issueattachments/:id
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    let file = await FileAttachment.findById(req.params.id)
      .populate('user project')
      .lean()

    if (!file) {
      return res.send('error/404')
    }

    if (file.user._id != req.user.id) {
      res.redirect(`/projects/details/${file.project._id}`)
    } else {
      await FileAttachment.remove({ _id: req.params.id  })
      fs.unlinkSync(file.file)
      res.redirect(`/projects/details/${file.project._id}`)
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
module.exports = router
