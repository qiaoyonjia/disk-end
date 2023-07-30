const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const koabody = require('koa-body')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const InitManager = require("./middleware/init")
const code = require('./middleware/code/code')
const checkToken = require('./middleware/checkToken')
const checkSecretKey = require('./middleware/checkSecretKey')
const download = require('./middleware/download')
const checkAvatar = require('./middleware/checkAvatar')

// error handler
onerror(app)



// middlewares
app.use(cors({
  // origin:'http://localhost:8080',
  maxAge:60*60,
}))
// app.use(async(ctx,next)=>{
//   ctx.set('Access-Control-Allow-Origin','http://localhost:8080')
//   if(ctx.method === 'OPTIONS'){
//     // ctx.set('Access-Control-Allow-Origin','http://localhost:8080')
//     ctx.set('Access-Control-Allow-Headers','secretkey,authorization,content-type')
//     ctx.set('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE,HEAD')
//     ctx.status = 204
//   }else{
//     await next()
//     // ctx.set('Access-Control-Allow-Origin','http://localhost:8080')
//   }
// })
app.use(json())
app.use(code)
app.use(checkAvatar)
app.use(download)
app.use(koabody({
  multipart:true, // 支持文件上传
  strict:false, //可处理delete请求
  formidable:{
    uploadDir:'./public/upload', // 设置文件上传缓存目录
    keepExtensions: true,    // 保持文件的后缀
    maxFileSize:2 * 1024 * 1024, // 文件上传大小
  }
}))
app.use(require('koa-static')(__dirname + '/public'))
app.use(logger())
app.use(checkSecretKey)
app.use(checkToken)



//自动导入路由
InitManager.init(app)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
