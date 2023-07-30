const { Sequelize } = require('sequelize')
const sequelize = require('../config/db')

let file = sequelize.define('yo_file',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:true,
    autoIncrement:true
  },
  file_id:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_name:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_memo:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_src:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_mini:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_owner:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_year:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_month:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_day:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_time:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_folder:{
    type:Sequelize.STRING,
    allowNull:true
  },
  file_size:{
    type:Sequelize.INTEGER,
    allowNull:true
  },
  file_type:{
    type:Sequelize.STRING,
    allowNull:true
  },
},
{
  timestamps: false,
  freezeTableName: true,
})
file.sync({
  force: false,
});

module.exports = file