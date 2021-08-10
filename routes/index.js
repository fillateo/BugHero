const express = require('express')
const faker = require('faker')

const router = express.Router()
const {
  isAuthenticated,
  redirectIfAuthenticated,
} = require('../middleware/auth')

const Issue = require('../models/Issue')
const Project = require('../models/Project')
const User = require('../models/User')
const Comment = require('../models/Comment')

// @desc    Dashboard/Landing page
// @route   GET /
router.get('/', isAuthenticated, async (req, res) => {
  const issuesByPriority = await Issue.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ])
  const issuesByType = await Issue.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ])
  const issuesOpen = await Issue.find({ status: 'Open' }).count()
  const issuesClosed = await Issue.find({ status: 'Closed' }).count()
  const projectsCount = await Project.count()
  const myProjects = await Project.find({ user: req.user }).count()

  res.render('dashboard', {
    issuesByPriority,
    issuesByType,
    projectsCount,
    issuesOpen,
    issuesClosed,
    myProjects,
  })
})

// @desc Login
// @route GET /login
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login')
})

/* eslint-disable no-await-in-loop */
// fake data generate
router.get('/generate-fake-project-data', async (req, res, next) => {
  for (let i = 0; i < 20; i += 1) {
    const project = new Project()

    project.user = await User.findOne()
    project.title = faker.commerce.productName()
    project.description = faker.commerce.productDescription()

    project.save((err) => {
      if (err) throw err
    })
  }
  res.redirect('/projects/1')
})

// fake data generate
router.get('/generate-fake-comment-data', async (req, res, next) => {
  for (let i = 0; i < 20; i += 1) {
    const comment = new Comment()

    comment.user = await User.findOne()
    comment.issue = await Issue.findById('6110fa761d20aa57bd35342e')
    comment.comment = faker.commerce.productDescription()

    comment.save((err) => {
      if (err) throw err
    })
  }
  res.redirect('/projects/1')
})
/* eslint-enable no-await-in-loop */

module.exports = router
