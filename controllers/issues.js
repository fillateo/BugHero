const Issue = require('../models/Issue')
const Project = require('../models/Project')
const Comment = require('../models/Comment')

module.exports = {
  new: async (req, res) => {
    try {
      const project = await Project.findOne({
        _id: req.params.projectId,
        members: { $in: req.user.id },
      })

      if (!project)
        return res.render('error/404', { layout: 'layouts/layoutError' })

      res.render('issues/new', {
        project,
      })
    } catch (error) {
      console.error(error)
      res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  store: async (req, res) => {
    try {
      const project = await Project.findOne({
        _id: req.params.projectId,
        members: { $in: req.user.id },
      })

      if (!project)
        return res.render('error/404', { layout: 'layouts/layoutError' })

      req.body.project = project
      req.body.user = req.user
      await Issue.create(req.body)
      res.redirect(`/projects/details/${req.params.projectId}`)
    } catch (error) {
      console.log(error)
      res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  details: async (req, res) => {
    try {
      const issue = await Issue.findById(req.params.id)
        .populate('user project')
        .lean()
      const project = await Project.findById(req.params.projectId)
        .populate('user')
        .lean()
      const commentsLength = await Comment.find({ issue: issue }).count()

      const perPage = 10
      const page = req.params.page || 1

      if (req.query.search) {
        Comment.find({
          issue: issue,
          $text: { $search: req.query.search },
        })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .sort('-createdAt')
          .populate('user')
          .lean()
          .exec((error, comments) => {
            Comment.find({ issue: issue })
              .count()
              .exec((err, count) => {
                if (!issue) {
                  return res.render('error/404', {
                    layout: 'layouts/layoutError',
                  })
                }

                if (err) throw err

                res.render('issues/detail', {
                  project,
                  issue,
                  comments,
                  current: page,
                  pages: Math.ceil(count / perPage),
                  search: req.query.search,
                  commentsLength,
                })
              })
          })
      } else {
        Comment.find({ issue: issue })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .sort('-createdAt')
          .populate('user')
          .lean()
          .exec((error, comments) => {
            Comment.find({ issue: issue })
              .count()
              .exec((err, count) => {
                if (!issue) {
                  return res.render('error/404', {
                    layout: 'layouts/layoutError',
                  })
                }

                if (err) throw err

                res.render('issues/detail', {
                  project,
                  issue,
                  comments,
                  current: page,
                  pages: Math.ceil(count / perPage),
                  search: '',
                  commentsLength,
                })
              })
          })
      }
    } catch (error) {
      console.log(error)
      res.render('error/404', { layout: 'layouts/layoutError' })
    }
  },

  edit: async (req, res) => {
    try {
      const issue = await Issue.findOne({
        _id: req.params.id,
      }).lean()
      const project = await Project.findById(req.params.projectId)

      if (!issue) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (issue.user != req.user.id) {
        res.redirect(
          `/issues/${req.params.projectId}/details/${req.params.id}/1`
        )
      } else {
        res.render('issues/edit', {
          project,
          issue,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  update: async (req, res) => {
    try {
      let issue = await Issue.findById(req.params.id).lean()

      if (!issue) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (issue.user != req.user.id) {
        res.redirect('/projects/1')
      } else {
        issue = await Issue.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })

        res.redirect(`/projects/details/${req.params.projectId}`)
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },
}
