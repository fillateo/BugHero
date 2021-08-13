const express = require('express')
const faker = require('faker')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { check, validationResult } = require('express-validator/check')
const { ensureAuthentication, generateProfileImage } = require('../config/auth')

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
  const projectsCount = await Project.find({ members: req.user.id }).count()
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
  res.render('login', { layout: 'layouts/layoutAuth' })
})
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next)
})

router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('register', { layout: 'layouts/layoutAuth' })
})

router.post('/register', (req, res) => {
  req.assert('firstName', 'First name is required').notEmpty()
  req.assert('username', 'Username is required').notEmpty()
  req.assert('email', 'Enter a valid email address').isEmail()
  req
    .assert('password', 'Password must be at least 6 charecters')
    .isLength({ min: 6 })
  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.render('register', {
      username: req.body.username,
      email: req.body.email,
    })
  }

  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      req.flash('errors', {
        msg: `Already a user with Email ${req.body.email}`,
      })
      return res.redirect('/login')
    }

    User.findOne({
      username: req.body.username,
    }).then((user) => {
      if (user) {
        req.flash('errors', {
          msg: `Already a user with username ${req.body.username}`,
        })
        return res.redirect('/register')
      }
    })

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      displayName: `${req.body.firstName} ${req.body.lastName}`,
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash
        newUser.image = generateProfileImage(newUser.email)

        newUser
          .save()
          .then((user) => {
            req.flash('success', {
              msg: 'Your account has been registered.',
            })
            return res.redirect('/login')
          })
          .catch((err) => {
            console.log(err)
          })
      })
    })
  })
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
