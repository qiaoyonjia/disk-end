const download = async (ctx, next) => {
  try {
    if (/static/.test(ctx.url)) {
      await next();
      //响应类型为通用，意思就是未知文件类型
      ctx.set("content-type", "application/octet-stream");
      //要求浏览器下载文件，而不是在浏览器中进行展示，如果将attachment改为inline，就是在浏览器内部进行展示，下载名为。。。
      ctx.set(
        "Content-Disposition",
        `attachment;filename=${ctx.url.split("/").pop()}`
      );
    } else {
      await next();
    }
  } catch (err) {
    ctx.body = {
      code: 821,
    };
  }
};

module.exports = download;
