const user = require("../model/user");
const question = require("../model/question");
const jwt = require("jsonwebtoken");
const sd = require("silly-datetime");
const fs = require("fs");
const mkData = require("../middleware/mockData");
const file = require("../model/file");
const { SECRET_KEY } = require("../config/base");

class Login {
  //登录
  static async login(ctx, next) {
    try {
      //获取用户名、密码
      const { user_name, user_password } = ctx.request.body;
      const userinfo = await user.findOne({
        attributes: [
          "user_id",
          "user_name",
          "user_password",
          "register_time",
          "user_avatar",
          "user_question",
          "user_answer",
        ],
        where: { user_name },
      });
      if (userinfo === null) {
        ctx.body = {
          code: 803,
        };
      } else {
        if (user_password == userinfo.user_password) {
          // 生成token
          const token = jwt.sign(
            {
              //token的创建日期
              time: Date.now(),
              //token的过期时间-1天有效期
              timeout: 24 * 60 * 60 * 1000,
              uid: userinfo.user_id,
            },
            SECRET_KEY
          );
          //获取用户收藏夹列表
          const result = await user.findOne({
            attributes: ["user_folder"],
            where: {
              user_name,
            },
          });
          const folders = result.user_folder.split("/");
          folders.shift();
          ctx.body = {
            code: 802,
            data: {
              user: userinfo,
              token,
              folders,
            },
          };
        } else {
          ctx.body = {
            code: 804,
          };
        }
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  // 注册
  static async signin(ctx, next) {
    try {
      const {
        user_name,
        user_password,
        user_question = "",
        user_answer = "",
        mock,
      } = ctx.request.body;
      //验证用户名是否规范
      if (/[^1-9A-Za-z]/.test(user_name)) {
        ctx.body = {
          code: 817,
        };
        return false;
      }
      if (user_name.length < 5 || user_name > 15) {
        ctx.body = {
          code: 818,
        };
        return false;
      }
      const result1 = await user.findOne({
        where: {
          user_name,
        },
      });
      // 用户名已经存在
      if (result1) {
        ctx.body = {
          code: 819,
        };
        return false;
      }
      const register_time = sd.format(new Date(), "YYYY/MM/DD");
      const user_id = Date.now();
      const result2 = await user.create({
        user_id,
        user_name,
        user_password,
        user_question,
        user_answer,
        register_time,
      });
      if (result2) {
        //生成用户上传文件夹
        fs.mkdirSync(`./public/static/${user_id}`);
        fs.mkdirSync(`./public/static/${user_id}/image`);
        fs.mkdirSync(`./public/static/${user_id}/video`);
        fs.mkdirSync(`./public/static/${user_id}/image/mini`);
        fs.mkdirSync(`./public/static/${user_id}/video/mini`);
        fs.mkdirSync(`./public/static/${user_id}/image/origin`);
        fs.mkdirSync(`./public/static/${user_id}/video/origin`);
      }
      if (mock == "mock") {
        const data = mkData(user_id);
        for (let item of data) {
          await file.create(item);
        }
      }
      ctx.body = {
        code: 820,
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  // 重置密码
  static async resetpassword(ctx, next) {
    try {
      const { user_name, user_password } = ctx.request.body;
      const result = await user.update(
        { user_password },
        { where: { user_name } }
      );
      if (result) {
        ctx.body = {
          code: 808,
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
  //获取用户密保问题和答案
  static async getUserQuestion(ctx, next) {
    try {
      const { user_name } = ctx.request.query;
      const result = await user.findOne({
        where: { user_name },
        attributes: ["user_question", "user_answer"],
      });
      if (result) {
        ctx.body = {
          code: 800,
          data: result,
        };
      } else {
        ctx.body = {
          code: 801,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //获取密保问题列表
  static async getQuestions(ctx, next) {
    try {
      const result = await question.findAll({
        attributes: ["question"],
      });
      let array = [];
      for (let item of result) {
        array.push(item.question);
      }
      ctx.body = {
        code: 800,
        data: array,
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  // 检测用户名唯一性
  static async checkName(ctx, next) {
    try {
      const { user_name } = ctx.request.body;
      const result = await user.findOne({
        where: {
          user_name,
        },
      });
      if (result) {
        //用户名已存在
        ctx.body = {
          code: 809,
        };
      } else {
        ctx.body = {
          code: 810,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
}

module.exports = Login;
