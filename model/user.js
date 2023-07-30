const { Sequelize } = require('sequelize')
const sequelize = require('../config/db')

let user = sequelize.define('yo_user',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:true,
    autoIncrement:true
  },
  user_id:{
    type:Sequelize.STRING,
    allowNull:true
  },
  user_name:{
    type:Sequelize.STRING,
    allowNull:true
  },
  user_password:{
    type:Sequelize.STRING,
    allowNull:true
  },
  user_avatar:{
    type:Sequelize.STRING,
    allowNull:true
  },
  user_rank:{
    type:Sequelize.INTEGER,
    allowNull:true
  },
  register_time:{
    type:Sequelize.STRING,
    allowNull:true
  },
  user_limit:{
    type:Sequelize.INTEGER,
    allowNull:true
  },
  user_consume:{
    type:Sequelize.INTEGER,
    allowNull:true
  },
  user_folder:{
    type:Sequelize.STRING,
    allowNull:true
  },
  user_question:{
    type:Sequelize.STRING,
    allowNull:true
  },
  user_answer:{
    type:Sequelize.STRING,
    allowNull:true
  },
},
{
  timestamps: false,
  freezeTableName: true,
})
user.sync({
  force: false,
});

module.exports = user