const express = require('express')

const router = express.Router()
const { isAuthenticated } = require('../middleware/auth')

const Issue = require('../models/Issue')
const Project = require('../models/Project')
const Comment = require('../models/Comment')

// @desc    Create new issues
// @route   GET /issues/:projectId/new
router.get('/:projectId/new', isAuthenticated, async (req, res) => {
  const project = await Project.findById(req.params.projectId)

  res.render('issues/new', {
    project,
  })
})

// @desc    Store issue
// @route   GET /issues/projectId
router.post('/:projectId', isAuthenticated, async (req, res) => {
  try {
    req.body.project = await Project.findById(req.params.projectId)
    req.body.user = req.user
    await Issue.create(req.body)
    res.redirect(`/projects/details/${req.params.projectId}`)
  } catch (error) {
    console.log(error)
    res.render('error/500')
  }
})

// @desc    Show issue details
// @route   GET /issues/:projectId/details/:id
router.get(
  '/:projectId/details/:id/:page',
  isAuthenticated,
  async (req, res) => {
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
                  return res.render('error/404')
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
                  return res.render('error/404')
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
      res.render('error/404')
    }
  }
)

// @desc    Edit issue
// @route   GET /issues/:projectId/edit/:id
router.get('/:projectId/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
    }).lean()
    const project = await Project.findById(req.params.projectId)

    if (!issue) {
      return res.render('error/404')
    }

    if (issue.user != req.user.id) {
      res.redirect(`/issues/${req.params.projectId}/details/${req.params.id}/1`)
    } else {
      res.render('issues/edit', {
        project,
        issue,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update issue
// @route   PUT /issues/:projectId/:id
router.put('/:projectId/:id', isAuthenticated, async (req, res) => {
  try {
    let issue = await Issue.findById(req.params.id).lean()

    if (!issue) {
      return res.render('error/404')
    }

    if (issue.user != req.user.id) {
      res.redirect('/projects')
    } else {
      issue = await Issue.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect(`/projects/details/${req.params.projectId}`)
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router
