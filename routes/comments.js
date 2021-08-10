const express = require('express')

const router = express.Router()
const { isAuthenticated } = require('../middleware/auth')

const Issue = require('../models/Issue')
const Comment = require('../models/Comment')

// @desc    Store comment
// @route   POST /comments/:issueId
router.post('/:issueId', isAuthenticated, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate('project')
      .lean()
    req.body.issue = issue
    req.body.user = req.user
    await Comment.create(req.body)
    res.redirect(`/issues/${issue.project._id}/details/${req.params.issueId}/1`)
  } catch (error) {
    console.log(error)
    res.render('error/500')
  }
})

// @desc    Process Update comment
// @route   PUT /comments/id
router.get('/edit/:id', isAuthenticated, async (req, res) => {
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
      return res.send('error/404')
    }

    if (issue.user._id.toString() != req.user._id) {
      res.redirect(`/issues/${issue.project._id}/details/${issue._id}/1`)
    } else {
      res.render('comments/edit', {
        comment,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Process Update comment
// @route   PUT /comments/id
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('issue user')
      .lean()
    const issue = await Issue.findById(comment.issue._id)
      .populate('project')
      .lean()

    if (!comment) {
      return res.send('error/404')
    }

    if (comment.user._id.toString() != req.user._id) {
      return res.send('error/404')
    }

    console.log('Lewat')
    await Comment.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })

    res.redirect(`/issues/${issue.project._id}/details/${issue._id}/1`)
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete comment
// @route   DELETE /comments/:issueId/:id
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('user issue')
      .lean()
    const issue = await Issue.findById(comment.issue._id)
      .populate('project')
      .lean()

    if (!comment) {
      return res.send('error/404')
    }

    if (comment.user._id.toString() != req.user._id) {
      return res.send('error/404')
    }

    await Comment.remove({ _id: req.params.id })
    res.redirect(`/issues/${issue.project._id}/details/${issue._id}/1`)
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router
