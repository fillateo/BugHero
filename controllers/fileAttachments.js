const fs = require('fs')
const Project = require('../models/Project')
const FileAttachment = require('../models/FileAttachment')

module.exports = {
  upload: async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId)

      if (project.user._id != req.user.id) {
        return res.redirect('/projects/1')
      }

      const file = req.file.path

      if (!file) {
        res.render('error/400', { layout: 'layouts/layoutError' })
      }

      req.body.project = project
      req.body.user = req.user
      req.body.file = file
      await FileAttachment.create(req.body)

      res.redirect(`/projects/details/${req.params.projectId}`)
    } catch (error) {
      console.log(error)
      res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  download: async (req, res) => {
    try {
      res.download(req.query.file)
    } catch (err) {
      console.log(err)
      res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  delete: async (req, res) => {
    try {
      const file = await FileAttachment.findById(req.params.id)
        .populate('user project')
        .lean()

      if (!file) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (file.user._id != req.user.id) {
        res.redirect(`/projects/details/${file.project._id}`)
      } else {
        await FileAttachment.remove({ _id: req.params.id })
        fs.unlinkSync(file.file)
        res.redirect(`/projects/details/${file.project._id}`)
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },
}
