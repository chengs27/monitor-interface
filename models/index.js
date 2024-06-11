// 6.启动数据库服务

const chalk = require('chalk');
const sequelize = require('./db');

const codeModel = require('./code')
const projectModel = require('./project')
const monitorModel = require('./detail')

projectModel.hasMany(codeModel)
codeModel.belongsTo(projectModel)

codeModel.hasMany(monitorModel)
monitorModel.belongsTo(codeModel)

// 启动

sequelize.sync({ alternate: true }).then(() => {
    console.log('[🐬🐬🐬 数据开启]:',chalk.green('数据库建立成功！'));
})