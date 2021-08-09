const mongoose = require('mongoose')

const { Schema } = mongoose

const FileAttachmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  file: {
    type: String,
    required: true,
  },
  description: String,
})

module.exports = mongoose.model('FileAttachment', FileAttachmentSchema)
