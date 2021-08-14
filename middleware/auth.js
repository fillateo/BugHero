const Project = require('../models/Project')

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
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
