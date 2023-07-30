const router = require('koa-router')()
const User = require('../controller/user')

router.prefix('/user')


router.post('/uploadAvatar',User.uploadAvatar)
router.put('/changePassword',User.changePassword)
router.put('/editQuestion',User.editQuestion)

module.exports = router
