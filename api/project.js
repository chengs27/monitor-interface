const router = require('express').Router();
const { Op, Sequelize } = require('sequelize');
const model = require('../models/project');
const codeModel = require('../models/code');

// 查询所有的项目
router.get('/', async(req, res) => {
    // 使用到 async await 的地方都要用 trycatch
    try {
        const {size,page} = req.query

        const { count, rows } = await model.findAndCountAll(
            {
                attributes: ['id', 'name', 'type', 'owner',
                    [Sequelize.literal(`(SELECT COUNT(*) FROM Codes WHERE Codes.projectId = Project.id)`), 'monitorCount']
                ],
                group: ['Project.id'],
                include: [{ model: codeModel, attributes: [],}],
                limit: Number(size),
                offset: (Number(page) - 1) * Number(size)
        });
        // console.log(1233321,count,rows)
        res.send({
            error: 0,
            msg: '查询成功',
            data: {
                result: rows,
                total: count.length,
            },
        })
    } catch(error) {
        console.log(error);
        // 如果查询异常了就返回整个
        res.send({
            error: 400,
            msg: '查询失败',
            errorMsg: error,
        })
    }
    
})

router.get('/single',async(req,res) => {
    try {
        const {id} = req.query
        const result = await model.findOne({
            where: {
                id
            }
        })
        res.send({
            error: 0,
            msg: '查询成功',
            data: result,
        })
    } catch(error) {
        console.log(error);
      // 如果查询异常了就返回整个
    }
})


router.post('/', async(req, res) => {
    try {
        const data = req.body;
        const [project,created] = await model.findOrCreate({
            where: {
                name: data.name,
            },
            defaults: { 
                ...data
            }  
        }); 
        if(created) {
            res.send({ 
                msg: '增加成功',
                error: 0,
            })
        }else {
            res.send({
                msg: '项目已存在',
                error:400
            })
        }
    }catch(err) {
        console.log(err)
        res.send({
            msg: '增加失败',
            errorMsg: err,
        })
    }  
})

router.put('/', async(req, res) => {
    try {
        const data = req.body
        console.log('数据',data)
        const result =  await model.update({
            name: data.name,
            owner: data.owner,
            type: data.type
        },{
            where: {
                id: data.id,
            },
        });
        console.log('结果',result)
        res.send({
            msg: '修改成功', 
            data: result,
            error: 0,

        })
    }catch (err) {
        console.log('修改失败的诗句',err,data)
        res.send({
            msg: '修改失败',
            errorMsg: err,

        })
    }
    
})

router.delete('/', async(req, res) => {
    const { id } = req.body;
    try {
        await model.destroy({
            where: {
                id,
            }
        });
        res.send({
            msg: '成功',
          })
       
    } catch(error) {
        res.send({
            msg: '删除失败',
            errorMsg: error,

        })
    }
})

module.exports = router