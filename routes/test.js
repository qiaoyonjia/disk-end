const router = require('koa-router')()


router.get('/test', async (ctx,next)=>{
  ctx.body={
    code:825,
  }
})


module.exports = router
