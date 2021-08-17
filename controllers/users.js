const passport = require('passport')
const bcrypt = require('bcrypt')

// Config
const generateProfileImage = require('../utils/generateProfileImage')

// models
const User = require('../models/User')

module.exports = {
  login: (req, res) => {
    res.render('users/login', { layout: 'layouts/layoutAuth' })
  },

  processLogin: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true,
    })(req, res, next)
  },

  register: (req, res) => {
    res.render('users/register', { layout: 'layouts/layoutAuth' })
  },

  create: (req, res) => {
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
        return res.redirect('/users/login')
      }

      User.findOne({
        username: req.body.username,
      }).then((user) => {
        if (user) {
          req.flash('errors', {
            msg: `Already a user with username ${req.body.username}`,
          })
          return res.redirect('/users/register')
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
              return res.redirect('/users/login')
            })
            .catch((err) => {
              console.log(err)
            })
        })
      })
    })
  },

  profile: async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/profile', { user })
  },
}
