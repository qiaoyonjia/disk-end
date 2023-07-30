const checkAvatar = async (ctx, next) => {
  try {
    if (ctx.url == "/user/uploadAvatar") {
      //获取数据大小
      const size = ctx.header["content-length"];
      if (size > 200 * 1024) {
        // ctx.status = 413;
        ctx.body = {
          code: 811,
        };
      } else {
        await next();
      }
    } else {
      //直接放行
      await next();
    }
  } catch (err) {
    ctx.body = {
      code: 821,
    };
  }
};

module.exports = checkAvatar;
