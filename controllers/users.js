const passport = require('passport')
const bcrypt = require('bcrypt')

// Utils
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
    req
      .assert('password', 'Password must be at least 6 charecters')
      .isLength({ min: 6 })
    const errors = req.validationErrors()

    if (errors) {
      req.flash('errors', errors)
      return res.redirect('/users/register')
    }

    User.findOne({
      email: req.body.email,
    }).then((user) => {
      if (user) {
        req.flash('errors', {
          msg: `Already a user with Email ${req.body.email}`,
        })
        return res.redirect('/users/register')
      }

      User.findOne({
        username: req.body.username,
      }).then((userByUsername) => {
        if (userByUsername) {
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

      bcrypt.genSalt(10, (errGenSalt, salt) => {
        bcrypt.hash(newUser.password, salt, (errHash, hash) => {
          newUser.password = hash
          newUser.image = generateProfileImage(newUser.email)

          newUser
            .save()
            .then((userSaved) => {
              if (userSaved) {
                req.flash('success', {
                  msg: 'Your account has been registered.',
                })
                return res.redirect('/users/login')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })
      })
    })
  },

  profile: async (req, res) => {
    const userProfile = await User.findById(req.params.id)
    res.render('users/profile', { userProfile })
  },

  edit: async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/edit', { user })
  },

  update: async (req, res) => {
    try {
      let user = await User.findById(req.params.id).lean()

      if (!user) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (user._id != req.user.id) {
        res.redirect(`/users/${req.params._id}`)
      } else {
        const userWithEmail = await User.findOne({ email: req.body.email })

        if (userWithEmail) {
          if ('email' in userWithEmail) {
            if (user.email != userWithEmail.email) {
              if (userWithEmail) {
                req.flash('errors', {
                  msg: `Already user with email ${req.body.email}`,
                })

                res.redirect(`/users/${req.params.id}/edit`)
              }
            }
          }
        }

        const userWithUsername = await User.findOne({
          username: req.body.username,
        })

        if (userWithUsername) {
          if ('username' in userWithUsername) {
            if (user.username != userWithUsername.username) {
              if (userWithUsername) {
                req.flash('errors', {
                  msg: `Already user with username ${req.body.username}`,
                })

                res.redirect(`/users/${req.params.id}/edit`)
              }
            }
          }
        }

        user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })

        res.redirect(`/users/${req.params.id}`)
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  remove: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).lean()

      if (!user) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (user._id != req.user.id) {
        return res.redirect(`/users/${req.params.id}`)
      }
      await User.remove({ _id: req.params.id })
      res.redirect('/users/login')
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },
}
