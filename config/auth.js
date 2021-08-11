const crypto = require('crypto')

module.exports = {
  ensureAuthentication: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('errors', { msg: 'You need to logged in' })
    res.redirect('/login')
  },
  generateProfileImage: function (email) {
    const md5 = crypto.createHash('md5').update(email).digest('hex')
    return `https://www.gravatar.com/avatar/${md5}?s=200&d=identicon`
  },
}
