const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
  googleId: {
    type: String,
    //   required: true,
  },
  displayName: {
    type: String,
    //  required: true,
  },
  firstName: {
    type: String,
    //    required: true,
  },
  lastName: {
    type: String,
    //  required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.index({ '$**': 'text' })

module.exports = mongoose.model('User', UserSchema)
