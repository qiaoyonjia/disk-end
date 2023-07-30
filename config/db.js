const Sequelize = require('sequelize')
const config = require('./config')


const sequelize = new Sequelize(config.database, config.username,config.password, {
    host: config.host,
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    //解决中文输入问题
    define: {
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8_general_ci'
        }
    }
})
module.exports = sequelize