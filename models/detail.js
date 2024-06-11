const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const codeModel = require('./code')
const detail = sequelize.define( 'detail', {
    id: {
        type: DataTypes.INTEGER, // 定义数据类型
        primaryKey: true,  // 是主键
        autoIncrement: true,  // true表示自增
        allowNull: false, // false表示不允许为空
    },
    msg: {
        type: DataTypes.STRING, // 定义数据类型
        allowNull: false, // false表示不允许为空
    },
    userId: {
        type: DataTypes.INTEGER, // 定义数据类型
        allowNull: false, // false表示不允许为空
    },
    codeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: codeModel, 
          key: "id"
        }
    },
    // errorMsg: {
    //     type: DataTypes.STRING, // 定义数据类型
    //     allowNull: false, // false表示不允许为空
    // },
    router: {
        type: DataTypes.STRING, // 定义数据类型
        allowNull: false, // false表示不允许为空
    },
},{
    //创建时间
    createdAt: "createTime",
    // 更新时间
    updatedAt: "updateTime",
    // false 删除就会删除数据，true 删除只会有删除时间，数据不会消失
    paranoid: false,
    timestamps: true,
})

module.exports = detail;