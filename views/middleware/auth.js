module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    else {
      res.redirect('/login')
    }
  },

  redirectIfAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next()
    }
    else {
      res.redirect('/')
    }
  }
}
