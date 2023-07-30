const user = require("../model/user");
const fs = require("fs");
const { BASE_URL } = require("../config/base");

class User {
  //上传头像
  static async uploadAvatar(ctx, next) {
    try {
      const { user_id } = ctx.request.body;
      // 获取图片缓存路径
      const path = ctx.request.files.user_avatar.path;
      //扩展名
      const extension = path.split(".")[1];
      //头像服务器路径
      const user_avatar = `${BASE_URL}/static/${user_id}/avatar${Date.now()}.${extension}`;
      fs.renameSync(
        path,
        `./public/static/${user_id}/avatar${Date.now()}.${extension}`
      );
      const result = await user.update(
        { user_avatar },
        {
          where: {
            user_id,
          },
        }
      );
      if (result) {
        ctx.body = {
          code: 812,
          user_avatar,
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
      console.error("========================================");
    }
  }
  //修改密码
  static async changePassword(ctx, next) {
    try {
      const { user_id, user_password } = ctx.request.body;
      const result = await user.update(
        { user_password },
        {
          where: {
            user_id,
          },
        }
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
  //编辑密保问题
  static async editQuestion(ctx, next) {
    try {
      const { user_id, user_question, user_answer } = ctx.request.body;
      const result = await user.update(
        { user_question, user_answer },
        {
          where: {
            user_id,
          },
        }
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
}

module.exports = User;
