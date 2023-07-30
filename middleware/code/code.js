// 引入状态码映射表
const map = require('./map.js')

const code = async(ctx,next)=>{
  // 放行网络请求
  await next()
  // 拦截服务器返回的数据，根据code添加message字段
  ctx.body.message = map[ctx.body.code] || ''
}

module.exports = code
