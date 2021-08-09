const express = require('express')
const faker = require('faker')
const router = express.Router()
const { isAuthenticated,
  redirectIfAuthenticated } = require('../middleware/auth')

const Issue = require('../models/Issue')
const Project = require('../models/Project')
const User = require('../models/User')
const Comment = require('../models/Comment')

// @desc    Dashboard/Landing page
// @route   GET /
router.get('/', isAuthenticated, async (req, res) => {
  issuesByPriority = await Issue.aggregate([
    {$group: {_id: '$priority', count: {$sum: 1}}}
  ])
  issuesByType = await Issue.aggregate([
    {$group: {_id: '$type', count: {$sum: 1}}}
  ])
  issuesOpen = await Issue.find({ status: 'Open' }).count()
  issuesClosed = await Issue.find({ status: 'Closed' }).count()
  projectsCount = await Project.count()
  myProjects = await Project.find({ user: req.user }).count()

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

// fake data generate
router.get('/generate-fake-project-data', async function(req, res, next) {
  for (var i = 0; i < 20; i++) {
    var project = new Project()

    project.user = await User.findOne()
    project.title = faker.commerce.productName()
    project.description = faker.commerce.productDescription()

    project.save(function(err) {
      if (err) throw err

    })

  }
  res.redirect('/projects/1')

})

// fake data generate
router.get('/generate-fake-comment-data', async function(req, res, next) {
  for (var i = 0; i < 20; i++) {
    var comment = new Comment()

    comment.user = await User.findOne()
    comment.issue = await Issue.findById('6110fa761d20aa57bd35342e')
    comment.comment = faker.commerce.productDescription()

    comment.save(function(err) {
      if (err) throw err

    })

  }
  res.redirect('/projects/1')

})

module.exports = router
