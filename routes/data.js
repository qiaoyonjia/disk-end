const router = require('koa-router')()
const Data = require('../controller/data')

router.prefix('/data')

router.get('/getTimelineData', Data.getTimelineData)
router.get('/getTimelineDataLimit', Data.getTimelineDataLimit)
router.get('/getFolderData', Data.getFolderData)
router.post('/foundfolder',Data.foundFolder)
router.delete('/deleteFolder',Data.deleteFolder)
router.delete('/deleteFile',Data.deleteFile)
router.put('/editMemo',Data.editMemo)
router.post('/addFolder',Data.addFolder)
router.get('/getImageData',Data.getImageData)
router.get('/getVideoData',Data.getVideoData)
router.delete('/bulkDelete',Data.bulkDelete)
router.get('/getDateData',Data.getDateData)
router.get('/getDataLimit',Data.getDataLimit)
router.get('/getCounter',Data.getCounter)
router.put('/renameFile',Data.renameFile)


module.exports = router
