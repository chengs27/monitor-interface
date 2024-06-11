const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const project = sequelize.define('project',{
    id: {
        type: DataTypes.INTEGER, // 定义数据类型
        primaryKey: true,  // 是主键
        autoIncrement: true,  // true表示自增
        allowNull: false, // false表示不允许为空
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    //创建时间
    createdAt: "createTime",
    // 更新时间
    updatedAt: "updateTime",
    // false 删除就会删除数据，true 删除只会有删除时间，数据不会消失
    paranoid: false,
})

module.exports = project

