const mongoose = require('mongoose')

const { Schema } = mongoose

const IssueTypeSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  type: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('IssueType', IssueTypeSchema)
