const key1 = require("../model/key");

const checkSecretKey = async (ctx, next) => {
  try {
    //对test接口不做任何验证
    if (ctx.url === "/test") {
      await next();
    } else {
      const result = await key1.findOne();
      const key = result["key"];
      const secretKey = ctx.request.header["secretkey"];
      // if (key == secretKey) {
      //放行
      await next();
      // } else {
      //   //拒绝访问
      //   ctx.body = {
      //     code: 822,
      //   };
      // }
    }
  } catch (err) {
    ctx.body = {
      code: 821,
    };
  }
};

module.exports = checkSecretKey;
