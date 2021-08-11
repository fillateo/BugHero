const multer = require('multer')
const path = require('path')
// set storage engine
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/issueFileAttachments'))
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

module.exports = multer({ storage: diskStorage })
