const passport = require('passport')
const bcrypt = require('bcrypt')

// models
const User = require('../models/User')

// Utils
const generateProfileImage = require('../utils/generateProfileImage')

module.exports = {
  google: passport.authenticate('google', { scope: ['profile', 'email'] }),

  googleCallback: passport.authenticate('google', { failureRedirect: '/' }),

  redirect: (req, res) => {
    res.redirect('/')
  },

  processLogin: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true,
    })(req, res, next)
  },

  create: async (req, res) => {
    req
      .assert('password', 'Password must be at least 6 charecters')
      .isLength({ min: 6 })
    const errors = req.validationErrors()

    if (errors) {
      req.flash('errors', errors)
      return res.redirect('/users/register')
    }

    try {
      let existUser = await User.findOne({ email: req.body.email })

      if (existUser) {
        req.flash('errors', {
          msg: `Already a user with Email ${req.body.email}`,
        })

        return res.redirect('/users/register')
      }

      existUser = await User.findOne({ username: req.body.username })

      if (existUser) {
        req.flash('errors', {
          msg: `Already a user with username ${req.body.username}`,
        })

        return res.redirect('/users/register')
      }

      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: `${req.body.firstName} ${req.body.lastName}`,
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: req.body.password,
      })

      const saltLength = 10
      const salt = await bcrypt.genSalt(saltLength)

      if (salt) {
        const hash = await bcrypt.hash(newUser.password, salt)

        if (hash) {
          newUser.password = hash
          newUser.image = generateProfileImage(newUser.email)

          newUser
            .save()
            .then((user) => {
              if (user) {
                req.flash('success', {
                  msg: 'Your account has been registered.',
                })
                return res.redirect('/users/login')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
    } catch (error) {
      console.log(error)
    }
  },
}
