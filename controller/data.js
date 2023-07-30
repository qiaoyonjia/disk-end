const fs = require("fs");
const file = require("../model/file");
const user = require("../model/user");
const { Op } = require("sequelize");
const {BASE_URL} = require("../config/base");

class Data {
  //获取时间戳全部数据
  static async getTimelineData(ctx, next) {
    try {
      //获取参数
      let { user_id } = ctx.request.query;
      // 时间列表
      let time_list = [];
      let result = [];
      //获取用户最近十天的时间列表
      let a = await file.findAll({
        where: { file_owner: user_id },
        attributes: ["file_time"],
        order: [["file_time", "DESC"]],
        group: "file_time",
      });
      // 将查询结果push进时间列表
      for (let item of a) {
        time_list.push(item.file_time);
      }
      for (let item of time_list) {
        let b = await file.findAll({
          where: { file_owner: user_id, file_time: item },
          order: [["id", "DESC"]],
        });
        result.push(b);
      }
      //返回结果
      ctx.body = {
        code: 800,
        data: result,
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //获取时间戳数据分页
  static async getTimelineDataLimit(ctx, next) {
    try {
      const { user_id, page = 0, limit = 5 } = ctx.request.query;
      // 时间列表
      const time_list = [];
      const result = [];
      //获取用户最近十天的时间列表
      const a = await file.findAll({
        where: { file_owner: user_id },
        attributes: ["file_time"],
        order: [["file_time", "DESC"]],
        group: "file_time",
        offset: Number(page) * Number(limit),
        limit: Number(limit),
      });
      // 将查询结果push进时间列表
      for (let item of a) {
        time_list.push(item.file_time);
      }
      for (let item of time_list) {
        const b = await file.findAll({
          where: { file_owner: user_id, file_time: item },
          order: [["id", "DESC"]],
        });
        result.push(b);
      }
      //返回结果
      ctx.body = {
        code: 800,
        data: result,
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //统计收藏夹中图片和视频的数量
  static async getFolderData(ctx, next) {
    try {
      const { user_id, folder } = ctx.request.query;
      const result = await file.findAll({
        where: {
          file_owner: user_id,
          file_folder: {
            [Op.like]: `%${folder}%`,
          },
        },
      });
      //分别统计照片和视频的数量
      let image = 0;
      let video = 0;
      for (let item of result) {
        if (/image/.test(item.file_type)) {
          image++;
        } else {
          video++;
        }
      }
      ctx.body = {
        code: 800,
        data: {
          counter: {
            image,
            video,
          },
          result,
        },
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //创建收藏夹
  static async foundFolder(ctx, next) {
    try {
      const { user_id, folder_name } = ctx.request.body;
      //查找用户现有收藏夹
      const result1 = await user.findOne({
        attributes: ["user_folder"],
        where: {
          user_id,
        },
      });
      //判断收藏夹是否已存在
      if (result1.user_folder.includes(folder_name)) {
        ctx.body = {
          code: 816,
        };
      } else {
        let folder = result1.user_folder + "/" + folder_name;
        //更新
        const result2 = await user.update(
          { user_folder: folder },
          {
            where: {
              user_id,
            },
          }
        );
        if (result2) {
          ctx.body = {
            code: 808,
          };
        } else {
          ctx.body = {
            code: 807,
          };
        }
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //删除收藏夹
  static async deleteFolder(ctx, next) {
    try {
      const { user_id, folder_name } = ctx.request.body;
      //获取用户现有收藏夹
      const result1 = await user.findOne({
        attributes: ["user_folder"],
        where: {
          user_id,
        },
      });
      //删除
      const temp = result1.user_folder.replace(`/${folder_name}`, "");
      // 更新用户收藏夹
      const result2 = await user.update(
        { user_folder: temp },
        {
          where: {
            user_id,
          },
        }
      );
      //更新文件的file_folder字段
      const result3 = await file.update(
        { file_folder: "" },
        {
          where: {
            file_owner: user_id,
            file_folder: folder_name,
          },
        }
      );
      if (result2 && result3) {
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
  //文件重命名
  static async renameFile(ctx, next) {
    try {
      const { user_id, file_id, file_name } = ctx.request.body;
      const result = await file.update(
        { file_name },
        {
          where: {
            file_owner: user_id,
            file_id,
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
  //删除文件
  static async deleteFile(ctx, next) {
    try {
      const { file_id } = ctx.request.body;
      // 查询
      const result1 = await file.findOne({
        attributes:['file_src','file_mini'],
        where:{
          file_id,
        }
      })
      if(result1 === null){
        //未查询到要删除的条目
        ctx.body = {
          code:826
        }
        return
      }
      if(!/mock/.test(result1.file_src)){
        // 删除文件
        // 拼接删除路径
        const o = result1.file_src.replace(BASE_URL,'./public')
        const m = result1.file_mini.replace(BASE_URL,'./public')
          //执行删除操作
        fs.unlinkSync(o)
        fs.unlinkSync(m)
      }
      // 删除数据库条目
      const result2 = await file.destroy({
        where: {
          file_id,
        },
      });
      if (result2) {
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
        error: err,
      };
    }
  }
  //修改备忘
  static async editMemo(ctx, next) {
    try {
      const { file_id, user_id, file_memo } = ctx.request.body;
      const result = await file.update(
        { file_memo },
        {
          where: {
            file_owner: user_id,
            file_id,
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
  //将文件加入到收藏夹
  static async addFolder(ctx, next) {
    try {
      const { file_id, user_id, file_folder } = ctx.request.body;
      const result = await file.update(
        { file_folder },
        {
          where: {
            file_owner: user_id,
            file_id,
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
  //获取全部图片数据
  static async getImageData(ctx, next) {
    try {
      const { user_id } = ctx.request.query;
      const result = await file.findAll({
        where: {
          file_owner: user_id,
          file_type: {
            [Op.like]: `%image%`,
          },
        },
        order: [["id", "DESC"]],
        // limit:10,
      });
      if (result) {
        ctx.body = {
          code: 800,
          data: result,
        };
      } else {
        ctx.body = {
          code: 813,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //获取全部视频资源
  static async getVideoData(ctx, next) {
    try {
      const { user_id } = ctx.request.query;
      const result = await file.findAll({
        where: {
          file_owner: user_id,
          file_type: {
            [Op.like]: `%video%`,
          },
        },
        order: [["id", "DESC"]],
        // limit:10,
      });
      if (result) {
        ctx.body = {
          code: 800,
          data: result,
        };
      } else {
        ctx.body = {
          code: 813,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //批量删除
  static async bulkDelete(ctx, next) {
    try {
      const { user_id, file_list } = ctx.request.body;
      let success = [];
      for (let item of file_list) {
        const result = await file.destroy({
          where: {
            file_owner: user_id,
            file_id: item,
          },
        });
        if (result) {
          success.push(item);
        }
      }
      if (success.length == file_list.length) {
        ctx.body = {
          code: 814,
          data: success,
        };
      } else {
        ctx.body = {
          code: 815,
          data: success,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //获取特定日期的数据
  static async getDateData(ctx, next) {
    try {
      const { user_id, date_list } = ctx.request.query;
      //缓存查询结果
      const data = [];
      // 遍历
      for (let item of date_list) {
        const result = await file.findAll({
          where: {
            file_owner: user_id,
            file_time: item,
          },
        });
        if (result.length == 0) {
          // 如果查询结果为空，跳过以下操作
          continue;
        }
        const obj = {};
        obj[item] = result;
        data.push(obj);
      }
      ctx.body = {
        code: 800,
        data: data,
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //数据分页
  static async getDataLimit(ctx, next) {
    try {
      const { user_id, type = "all", page, limit } = ctx.request.query;
      if (type == "image") {
        //查询图片
        const result = await file.findAll({
          where: {
            file_owner: user_id,
            file_type: {
              [Op.like]: `%image%`,
            },
          },
          order: [["id", "DESC"]],
          offset: Number(page) * Number(limit),
          limit: Number(limit),
        });
        ctx.body = {
          code: 800,
          data: result,
        };
      } else if (type == "video") {
        //查询视频
        const result = await file.findAll({
          where: {
            file_owner: user_id,
            file_type: {
              [Op.like]: `%video%`,
            },
          },
          order: [["id", "DESC"]],
          offset: Number(page) * Number(limit),
          limit: Number(limit),
        });
        ctx.body = {
          code: 800,
          data: result,
        };
      } else if (type == "all") {
        const result = await file.findAll({
          where: {
            file_owner: user_id,
          },
          order: [["id", "DESC"]],
          offset: Number(page) * Number(limit),
          limit: Number(limit),
        });
        ctx.body = {
          code: 800,
          data: result,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
  //数据统计
  static async getCounter(ctx, next) {
    try {
      const { user_id } = ctx.request.query;
      //统计照片数量
      const image = await file.count({
        where: {
          file_owner: user_id,
          file_type: {
            [Op.like]: `%image%`,
          },
        },
      });
      //统计视频数量
      const video = await file.count({
        where: {
          file_owner: user_id,
          file_type: {
            [Op.like]: `%video%`,
          },
        },
      });
      //统计文件总大小
      const size = await file.sum("file_size");
      //用户可使用空间
      // const limit = await user.findOne({
      //   where: {
      //     user_id,
      //   },
      //   attributes: ["user_limit"],
      // });
      ctx.body = {
        code: 800,
        data: {
          image,
          video,
          size,
          // limit: limit.user_limit,
        },
      };
    } catch (err) {
      ctx.body = {
        code: 821,
      };
    }
  }
}

module.exports = Data;
