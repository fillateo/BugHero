const Project = require('../models/Project')

const Issue = require('../models/Issue')
const FileAttachment = require('../models/FileAttachment')

module.exports = {
  new: (req, res) => {
    res.render('projects/new')
  },

  store: async (req, res) => {
    try {
      req.body.user = req.user
      const project = await Project.create(req.body)
      await Project.findOneAndUpdate(
        { _id: project._id },
        { $push: { members: req.user.id } },
        {
          new: true,
          useFindAndModify: false,
        }
      )
      res.redirect('/projects/1')
    } catch (error) {
      console.log(error)
      res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  showAll: async (req, res) => {
    try {
      const perPage = 20
      const page = req.params.page || 1

      if (req.query.search) {
        Project.find({
          members: { $in: req.user.id },
          $text: { $search: req.query.search },
        })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .populate('user')
          .lean()
          .exec((error, projects) => {
            Project.count().exec((err, count) => {
              if (err) throw err
              res.render('projects/list', {
                projects,
                current: page,
                pages: Math.ceil(count / perPage),
                search: req.query.search,
              })
            })
          })
      } else {
        Project.find({ members: { $in: req.user.id } })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .populate('user')
          .lean()
          .exec((error, projects) => {
            Project.count().exec((err, count) => {
              if (err) throw err
              res.render('projects/list', {
                projects,
                current: page,
                pages: Math.ceil(count / perPage),
                search: '',
              })
            })
          })
      }
    } catch (error) {
      console.log(error)
      res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  details: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate('members user')
        .lean()
      const issues = await Issue.find({ project: project._id })
        .populate('user')
        .lean()
      const fileAttachments = await FileAttachment.find({
        project: project._id,
      })
        .populate('project')
        .lean()

      if (!project) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }
      res.render('projects/detail', {
        project,
        issues,
        fileAttachments,
      })
    } catch (error) {
      console.log(error)
      res.render('error/404', { layout: 'layouts/layoutError' })
    }
  },

  edit: async (req, res) => {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
      }).lean()

      if (!project) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (project.user != req.user.id) {
        res.redirect('/projects/1')
      } else {
        res.render('projects/edit', {
          project,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  update: async (req, res) => {
    try {
      let project = await Project.findById(req.params.id).lean()

      if (!project) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (project.user != req.user.id) {
        res.redirect('/projects/1')
      } else {
        project = await Project.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        )

        res.redirect(`/projects/details/${req.params.id}`)
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  remove: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).lean()

      if (!project) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (project.user != req.user.id) {
        res.redirect('/projects/1')
      } else {
        await Project.remove({ _id: req.params.id })
        await Issue.remove({ project: project })
        res.redirect('/projects/1')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },
}
