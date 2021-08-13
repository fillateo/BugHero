const mongoose = require('mongoose')

const { Schema } = mongoose

const ProjectSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
)

ProjectSchema.index({ '$**': 'text' })

module.exports = mongoose.model('Project', ProjectSchema)
