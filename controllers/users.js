// models
const User = require('../models/User')

module.exports = {
  login: (req, res) => {
    res.render('users/login', {
      layout: 'layouts/layoutAuth',
    })
  },

  register: (req, res) => {
    res.render('users/register', { layout: 'layouts/layoutAuth' })
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
