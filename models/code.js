// 4.定义数据表、字段


const sequelize = require('./db'); // 这里是上一步创建的实例（在上一步指定了对哪个数据表进行操作）
const { DataTypes } = require('sequelize');
const projectModel = require('./project')
// 定义一个表叫做code表，有id,code,codeName三个字段

const model = sequelize.define('code',{
    id: {
        type: DataTypes.INTEGER, // 定义数据类型
        primaryKey: true,  // 是主键
        autoIncrement: true,  // true表示自增
        allowNull: false, // false表示不允许为空
    },
    code: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    codeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: projectModel, 
          key: "id"
        }
    }
},{
    //创建时间
    createdAt: "createTime",
    // 更新时间
    updatedAt: "updateTime",
    // false 删除就会删除数据，true 删除只会有删除时间，数据不会消失
    paranoid: false,
    timestamps: true,

    
})

module.exports = model
