const faker = require('faker')

const Issue = require('../models/Issue')
const Project = require('../models/Project')
const User = require('../models/User')
const Comment = require('../models/Comment')

module.exports = {
  index: async (req, res) => {
    const issuesByPriority = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ])
    const issuesByType = await Issue.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ])
    const issuesOpen = await Issue.find({ status: 'Open' }).count()
    const issuesClosed = await Issue.find({ status: 'Closed' }).count()
    const projectsCount = await Project.find({ members: req.user.id }).count()
    const myProjects = await Project.find({ user: req.user }).count()

    res.render('dashboard', {
      issuesByPriority,
      issuesByType,
      projectsCount,
      issuesOpen,
      issuesClosed,
      myProjects,
    })
  },

  /* eslint-disable no-await-in-loop */
  generateFakeProject: async (req, res, next) => {
    for (let i = 0; i < 20; i += 1) {
      const project = new Project()

      project.user = await User.findOne()
      project.title = faker.commerce.productName()
      project.description = faker.commerce.productDescription()

      project.save((err) => {
        if (err) throw err
      })
    }
    res.redirect('/projects/1')
  },

  generateFakeComment: async (req, res, next) => {
    for (let i = 0; i < 20; i += 1) {
      const comment = new Comment()

      comment.user = await User.findOne()
      comment.issue = await Issue.findById('6110fa761d20aa57bd35342e')
      comment.comment = faker.commerce.productDescription()

      comment.save((err) => {
        if (err) throw err
      })
    }
    res.redirect('/projects/1')
  },
  /* eslint-disable no-await-in-loop */
}
