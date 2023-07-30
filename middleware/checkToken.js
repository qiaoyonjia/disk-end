const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/base");

const checkToken = async (ctx, next) => {
  try {
    //对test接口不做任何验证
    if (ctx.url === "/test") {
      await next();
    } else {
      //获取请求路由
      let url = ctx.url;
      //请求/login或静态资源无需验证token
      if (/login/.test(url) || /static/.test(url)) {
        await next();
      } else {
        let token = ctx.request.header["authorization"];
        // 解析token
        if (token == "null") {
          //token不存在
          ctx.body = {
            code: 805,
          };
        } else {
          //有token则进行解析
          await jwt.verify(token, SECRET_KEY, async (err, token_obj) => {
            if (err) {
              ctx.body = {
                code: 823,
              };
              return;
            } else {
              let { time, timeout, uid } = token_obj;
              //获取当前时间
              let now = Date.now();
              // 判断token是否过期
              if (now - time <= timeout) {
                //没有过期
                if (ctx.method === "GET") {
                  ctx.request.query.user_id = uid;
                } else {
                  ctx.request.body.user_id = uid;
                }
                await next();
              } else {
                //过期
                ctx.body = {
                  code: 806,
                };
              }
            }
          });
        }
      }
    }
  } catch (err) {
    ctx.body = {
      code: 821,
    };
  }
};

module.exports = checkToken;
