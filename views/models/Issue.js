const mongoose = require('mongoose')

const { Schema } = mongoose

const IssueSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['Bug', 'Feature', 'Discussion'],
    default: 'Bug',
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['None', 'Low', 'Medium', 'High'],
    default: 'None',
  },
},
{
  timestamps: true,
})

module.exports = mongoose.model('Issue', IssueSchema)
