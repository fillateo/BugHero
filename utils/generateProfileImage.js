const crypto = require('crypto')

module.exports = (email) => {
  const md5 = crypto.createHash('md5').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${md5}?s=200&d=identicon`
}
