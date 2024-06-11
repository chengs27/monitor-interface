// 1.创建一个服务 

// 创建一个服务
const express = require('express')
const cors = require('cors')
const app = express()

// 美化输出
const chalk = require('chalk')

// 监听的端口是3000
const port = 3000

// 跨域
app.use(cors())

// 能解析键值对
app.use(express.urlencoded({ extended: true }))
// 能解析json
app.use(express.json())

// 引入数据库启动的代码 
require('./models/index')
// api表示是用于接口请求,code表示是使用code表
app.use('/api/code', require('./api/code'));
app.use('/api/project', require('./api/project'));
app.use('/api/detail', require('./api/detail'));

// 2.启动服务
app.listen(port, () => {
    console.log(`[🚀🚀🚀 原神启动]: `, chalk.underline.cyan(`http://localhost:${port}`))
})