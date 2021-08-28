const mongoose = require('mongoose')

const { Schema } = mongoose

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['COMMENTED', 'ISSUE_STATUS', 'NEW_ISSUE', 'REFERENCED'],
    },
    byUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromIssue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
    },
    onIssue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
    },
    issueStatus: { type: String, enum: ['Open', 'Closed'] },
    references: [{ type: Schema.Types.ObjectId, ref: 'Issue' }],

    notificationTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

NotificationSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Notification', NotificationSchema)
