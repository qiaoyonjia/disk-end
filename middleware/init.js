const requireDirectory = require("require-directory");
const Router = require("koa-router");

class InitManager {
    // app; // 这种写法在node.js中是错误的
  
    // 统一初始化方法
    static init(app) {
        // node.js中不支持在类中加属性的写法
        InitManager.app = app;
        InitManager.initLoadRouters();
    }

    // 路由自动注册
    static initLoadRouters() {
        // 获取api目录的绝对路径
        const apiDirectory = `${process.cwd()}/routes`
        requireDirectory(module, apiDirectory, {
            visit: (obj) => {
                if(obj instanceof Router) {
                    InitManager.app.use(obj.routes());
                }
            }
        })
    }
}

module.exports = InitManager