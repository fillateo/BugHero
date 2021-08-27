const Project = require('../models/Project')
const User = require('../models/User')

module.exports = {
  user: async (req, res) => {
    try {
      const perPage = 20
      const page = req.params.page || 1

      const project = await Project.findById(req.params.projectId)

      if (req.query.search) {
        User.find({
          _id: { $nin: project.members },
          $text: { $search: req.query.search },
        })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .exec((error, users) => {
            User.count().exec((err, count) => {
              if (err) throw err
              res.render('projectMembers/new', {
                users,
                project,
                current: page,
                pages: Math.ceil(count / perPage),
                search: req.query.search,
              })
            })
          })
      } else {
        User.find({ _id: { $nin: project.members } })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .exec((error, users) => {
            User.count().exec((err, count) => {
              if (err) throw err
              res.render('projectMembers/new', {
                users,
                project,
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

  add: async (req, res) => {
    try {
      let project = await Project.findById(req.params.projectId).lean()

      if (!project) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (project.user != req.user.id) {
        return res.redirect('/projects/1')
      }

      project = await Project.findOneAndUpdate(
        { _id: req.params.projectId },
        { $push: { members: req.body.user } },
        {
          new: true,
          useFindAndModify: false,
        }
      )

      res.redirect(`/projects/details/${req.params.projectId}`)
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  remove: async (req, res) => {
    try {
      let project = await Project.findById(req.params.projectId)
        .populate('members user')
        .lean()

      if (!project) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (project.user._id != req.user.id) {
        res.redirect('/projects/1')
      } else {
        project = await Project.findOneAndUpdate(
          { _id: req.params.projectId },
          { $pull: { members: req.body.user } },
          {
            new: true,
            useFindAndModify: false,
          }
        )

        res.redirect(`/projects/details/${req.params.projectId}`)
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },
}
