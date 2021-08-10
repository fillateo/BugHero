module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }

    return res.redirect('/login')
  },

  redirectIfAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next()
    }

    return res.redirect('/')
  },
}
