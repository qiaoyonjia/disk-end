const router = require('koa-router')()
const Upload = require('../controller/upload')

router.prefix('/upload')

router.post('/upload',Upload.upload)
router.post('/completed',Upload.merge)

module.exports = router