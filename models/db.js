// 3. 用于创建操作数据库的实例


const { Sequelize } = require('sequelize')
// 连接数据库
const sequelize = new Sequelize('monitor','root','123456', {
    timezone: '+08:00',
    host: 'localhost',
    dialect: 'mysql', // 数据库是 mysql
    logging: false,  //是否打开日志 
});

module.exports = sequelize