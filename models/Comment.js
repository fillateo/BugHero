const mongoose = require('mongoose')

const { Schema } = mongoose

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    issue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

CommentSchema.index({ '$**': 'text' })

module.exports = mongoose.model('Comment', CommentSchema)
