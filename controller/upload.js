const fs = require("fs");
const file = require("../model/file");
const sd = require("silly-datetime");
const SparkMD5 = require("spark-md5");
const { BASE_URL } = require("../config/base");
class Upload {
  //上传接口
  static async upload(ctx, next) {
    try {
      //koa-body通过ctx.request.files可获取上传的文件
      //获取文件夹hash、切片索引
      let { hash, index } = ctx.request.body;
      if (fs.existsSync(`./public/upload/${hash}`)) {
      } else {
        fs.mkdirSync(`./public/upload/${hash}`);
      }
      //获取上传文件的临时文件名
      let chunk_name = ctx.request.files.chunk.path.split("upload\\")[1];
      //将文件切片移动到用户文件夹下
      fs.renameSync(
        `./public/upload/${chunk_name}`,
        `./public/upload/${hash}/${hash + "_" + index}`,
        (err) => {
          console.log(err);
        }
      );
      ctx.body = {
        code: 812,
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //合并切片
  static async merge(ctx, next) {
    try {
      //接受切片总数和文件夹hash
      let {
        user_id,
        hash,
        chunkNum,
        file_type,
        file_name,
        file_size,
        file_mini,
      } = ctx.request.body;
      // 将切片写入用户文件夹下,然后删除切片
      let origin_path = `./public/static/${user_id}/${
        file_type.split("/")[0]
      }/origin/${file_name}`;
      for (let i = 0; i < chunkNum; i++) {
        fs.appendFileSync(
          origin_path,
          fs.readFileSync(`./public/upload/${hash}/${hash}_${i}`)
        );
        fs.unlinkSync(`./public/upload/${hash}/${hash}_${i}`);
      }
      //将base64格式的迷你图转为png格式
      const base64Data = file_mini.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(
        `./public/static/${user_id}/${
          file_type.split("/")[0]
        }/mini/${SparkMD5.hash(file_name.split(".")[0])}.png`,
        buffer
      );
      //写入数据库
      let file_time = sd.format(new Date(), "YYYY/MM/DD");
      let time_arr = file_time.split("/");
      let file_year = time_arr[0];
      let file_month = time_arr[1];
      let file_day = time_arr[2];
      let file_id = Date.now();
      let result = await file.create({
        file_id,
        file_name: file_name,
        file_src: `${BASE_URL}/static/${user_id}/${
          file_type.split("/")[0]
        }/origin/${file_name}`,
        file_mini: `${BASE_URL}/static/${user_id}/${
          file_type.split("/")[0]
        }/mini/${SparkMD5.hash(file_name.split(".")[0])}.png`,
        file_owner: user_id,
        file_year,
        file_month,
        file_day,
        file_time,
        file_size: file_size,
        file_type: file_type,
      });
      if (result) {
        ctx.body = {
          code: 808,
          data: {
            file_id,
            file_name: file_name,
            file_src: `${BASE_URL}/static/${user_id}/${
              file_type.split("/")[0]
            }/origin/${file_name}`,
            file_mini: `${BASE_URL}/static/${user_id}/${
              file_type.split("/")[0]
            }/mini/${SparkMD5.hash(file_name.split(".")[0])}.png`,
            file_owner: user_id,
            file_year,
            file_month,
            file_day,
            file_time,
            file_size: file_size,
            file_type: file_type,
          },
        };
      } else {
        ctx.body = {
          code: 807,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
}

module.exports = Upload;
