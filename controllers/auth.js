const passport = require('passport')

module.exports = {
  google: passport.authenticate('google', { scope: ['profile', 'email'] }),

  googleCallback: passport.authenticate('google', { failureRedirect: '/' }),

  redirect: (req, res) => {
    res.redirect('/')
  },
}
