const express = require('express')

const router = express.Router()

const { isAuthenticated } = require('../middleware/auth')
const Project = require('../models/Project')
const Issue = require('../models/Issue')
const FileAttachment = require('../models/FileAttachment')

// @desc    Show add project page
// @route   GET /projects/new
router.get('/new', isAuthenticated, (req, res) => {
  res.render('projects/new')
})

// @desc    Process add form
// @route   POST /projects
router.post('/', isAuthenticated, async (req, res) => {
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
})

// @desc    Show all projects
// @route   GET /projects/:page
router.get('/:page', isAuthenticated, async (req, res) => {
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
})

// @desc    Show project details
// @route   GET /projects/details/:id
router.get('/details/:id', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members user')
      .lean()
    const issues = await Issue.find({ project: project._id })
      .populate('user')
      .lean()
    const fileAttachments = await FileAttachment.find({ project: project._id })
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
})

// @desc    Edit project
// @route   GET /projects/edit/:id
router.get('/edit/:id', isAuthenticated, async (req, res) => {
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
})

// @desc    Update project
// @route   PUT /projects/:id
router.put('/:id', isAuthenticated, async (req, res) => {
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
})

// @desc    Delete project
// @route   DELETE /projects/:id
router.delete('/:id', isAuthenticated, async (req, res) => {
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
})

module.exports = router
