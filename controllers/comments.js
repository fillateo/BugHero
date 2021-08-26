const Issue = require('../models/Issue')
const Comment = require('../models/Comment')

module.exports = {
  store: async (req, res) => {
    try {
      const issue = await Issue.findById(req.params.issueId)
        .populate('project')
        .lean()
      req.body.issue = issue
      req.body.user = req.user
      await Comment.create(req.body)
      res.redirect(
        `/issues/${issue.project._id}/details/${req.params.issueId}/1`
      )
    } catch (error) {
      console.log(error)
      res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  edit: async (req, res) => {
    try {
      const comment = await Comment.findOne({
        _id: req.params.id,
      })
        .populate('issue')
        .lean()
      const issue = await Issue.findById(comment.issue._id)
        .populate('project')
        .lean()

      if (!comment) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (comment.user != req.user.id) {
        res.redirect(`/issues/${issue.project._id}/details/${issue._id}/1`)
      } else {
        res.render('comments/edit', {
          comment,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  update: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id)
        .populate('issue')
        .lean()
      const issue = await Issue.findById(comment.issue._id)
        .populate('project')
        .lean()

      if (!comment) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (comment.user != req.user.id) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      await Comment.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect(`/issues/${issue.project._id}/details/${issue._id}/1`)
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },

  delete: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id)
        .populate('issue')
        .lean()
      const issue = await Issue.findById(comment.issue._id)
        .populate('project')
        .lean()

      if (!comment) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      if (comment.user != req.user.id) {
        return res.render('error/404', { layout: 'layouts/layoutError' })
      }

      await Comment.remove({ _id: req.params.id })

      res.redirect(`/issues/${issue.project._id}/details/${issue._id}/1`)
    } catch (err) {
      console.error(err)
      return res.render('error/500', { layout: 'layouts/layoutError' })
    }
  },
}
