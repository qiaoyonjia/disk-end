const { Sequelize } = require('sequelize')
const sequelize = require('../config/db')

let key = sequelize.define('yo_key',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:true,
    autoIncrement:true
  },
  key:{
    type:Sequelize.STRING,
    allowNull:true
  },
},
{
  timestamps: false,
  freezeTableName: true,
})
key.sync({
  force: false,
});

module.exports = key