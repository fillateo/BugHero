module.exports = {
  checkProjectMember: (res, project) => {
    if (!project) {
      return res.redirect('/')
    }
  },

  checkProjectMemberFilter: (user, res, members) => {
    const projectMember = members.filter((member) => user.id == member)

    if (!projectMember)
      return res.render('error/404', { layout: 'layouts/layoutError' })
  },
}
