const { Sequelize } = require('sequelize')
const sequelize = require('../config/db')

let question = sequelize.define('yo_question',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:true,
    autoIncrement:true
  },
  question:{
    type:Sequelize.STRING,
    allowNull:true
  },
},
{
  timestamps: false,
  freezeTableName: true,
})
question.sync({
  force: false,
});

module.exports = question