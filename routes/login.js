const router = require('koa-router')()
const Login = require('../controller/login')

router.prefix('/login')

router.post('/login',Login.login)
router.post('/signin',Login.signin)
router.post('/resetpassword',Login.resetpassword)
router.get('/getquestions',Login.getQuestions)
router.post('/checkname',Login.checkName)
router.get('/getuserquestion',Login.getUserQuestion)

module.exports = router