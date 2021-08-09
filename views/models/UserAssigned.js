const mongoose = require('mongoose')

const { Schema } = mongoose

const UserAssignedSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

module.exports = mongoose.model('UserAssigned', UserAssignedSchema)
