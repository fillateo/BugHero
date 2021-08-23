const Project = require('../models/Project')

const checkUsername = (req) =>
  !req.user.username && req.path != `/${req.user._id}/edit`

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (checkUsername(req) && req.method == 'GET') {
        req.flash('errors', { msg: 'You need to add username' })
        return res.redirect(`/users/${req.user._id}/edit`)
      }
      return next()
    }

    req.flash('errors', { msg: 'You need to logged in' })
    return res.redirect('/users/login')
  },

  redirectIfAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next()
    }

    return res.redirect('/')
  },

  isProjectMember: (projectId) => async (req, res, next) => {
    const project = await Project.findById(projectId, {
      members: { $in: req.user.id },
    })
    if (project.length > 0) {
      return next()
    }

    return res.redirect('/')
  },
}
