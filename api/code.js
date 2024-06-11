// 5. 定义方法   提供一些方法给其他人调用。
// 对code表操作，建立一个code.js 表示对dode表提供的操作方法

// 需要从express引入router
const { Op, Sequelize } = require('sequelize');
const router = require('express').Router();
const model = require('../models/code');
const monitorModel = require('../models/detail')

 // get请求 / 路径的时候会进到这里  （实际是 http://localhost:3000/api/code/）
// 如果这里写的是 /a 那么请求  http://localhost:3000/api/code/a 就会到这里
router.get('/', async(req, res) => {
    // 使用到 async await 的地方都要用 trycatch
    try {
      // 上一步定义了表（定义一个表可以抽象为定义一个模型）
      // 这里表提供了一个 查询所有表数据的方法 findAll 可以查到这个表所有数据
      const { pId,codeId, size, page } = req.query;
      // codeId && (where['id'] = {
      //   [Op.eq]: codeId
      // })
      // console.log('fddfds',codeId)
      const today = new Date(); // 当前日期
      const yesterday = new Date(today); // 昨天的日期
      yesterday.setDate(yesterday.getDate() - 1); // 将日期减去1天
      const startOfToday = today.setHours(0, 0, 0, 0);
      const startOfYesterday = yesterday.setHours(0, 0, 0, 0); // 昨天的开始时间
      const endOfYesterday = yesterday.setHours(23, 59, 59, 999); // 昨天的结束时间
      
      const { count, rows } = await model.findAndCountAll({ 
        where: {
          projectId: pId
        },
        // group: ['Code.id'],
        limit: Number(size),
        offset: (Number(page) - 1) * Number(size)

      });
      const p = await Promise.allSettled(rows.map(async (item) => {
        const todayCount = await monitorModel.count({
          where: {
            codeId:{
              [Op.eq]: item.id
            },
            createTime: {
              [Op.between]: [new Date() - 1000 * 60 * 60 * 24 , new Date()]
            }
          }
        })
        console.log(todayCount)
        const yesterdayCount = await monitorModel.count({
          where: {
            id: item.id,
            createTime: {
                [Op.gte]: startOfYesterday, // 大于等于昨天的开始时间
                [Op.lt]: endOfYesterday, // 小于昨天的结束时间
            }
          }
        })

        const line = await monitorModel.count({
          where: {
            codeId:{
              [Op.eq]: item.id
            },
            createTime: {
              [Op.between]: [startOfToday , new Date()]
            }
          },
          attributes: [
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('createTime'),'%H'), 'hour']
          ],
          group: ['hour'],
        })
        console.log('line',line)
        const todayList = [
          { time: '00', value: 0, type: 'today' },
          { time: '01', value: 0, type: 'today' },
          { time: '02', value: 0, type: 'today' },
          { time: '03', value: 0, type: 'today' },
          { time: '04', value: 0, type: 'today' },
          { time: '05', value: 0, type: 'today' },
          { time: '06', value: 0, type: 'today' },
          { time: '07', value: 0, type: 'today' },
          { time: '08', value: 0, type: 'today' },
          { time: '09', value: 0, type: 'today' },
          { time: '10', value: 0, type: 'today' },
          { time: '11', value: 0, type: 'today' },
          { time: '12', value: 0, type: 'today' },
          { time: '13', value: 0, type: 'today' },
          { time: '14', value: 0, type: 'today' },
          { time: '15', value: 0, type: 'today' },
          { time: '16', value: 0, type: 'today' },
          { time: '17', value: 0, type: 'today' },
          { time: '18', value: 0, type: 'today' },
          { time: '19', value: 0, type: 'today' },
          { time: '20', value: 0, type: 'today' },
          { time: '21', value: 0, type: 'today' },
          { time: '22', value: 0, type: 'today' },
          { time: '23', value: 0, type: 'today' },
        ];
      
        todayList.forEach((item) => {
            line.forEach(it => {
                if(item.time === it.hour){
                    item.value = it.count
                }
            });  
        });
        console.log(todayList)
        return {
          ...item,
          todayCount,
          yesterdayCount,
          todayList
        }
      }));
      // 查询完通过 res.send 返回
      res.send({
        msg: '查询成功',
        data: {
          result: rows,
          total: count,
          // line: p.filter(item => item.status === 'fulfilled').map(item => item.value)
      },
        count: p.filter(item => item.status === 'fulfilled').map(item => item.value),
      })
    } catch(error) {
      // 如果查询异常了就返回整个
      console.log(error)
      res.send({
        msg: '查询失败',
        errorMsg: error,
      })
    }

  
})


router.get('/single', async(req, res) => {
  // 使用到 async await 的地方都要用 trycatch
  const { codeId } = req.query;
  try {
    // 上一步定义了表（定义一个表可以抽象为定义一个模型）
    // 这里表提供了一个 查询所有表数据的方法 findAll 可以查到这个表所有数据
    
    const result = await model.findOne({
      where: {
        id: codeId
      }

    });
    // 查询完通过 res.send 返回
    res.send({
      msg: '查询成功',
      data: result,
    })
  } catch(error) {
    // 如果查询异常了就返回整个
    res.send({
      msg: '查询失败',
      errorMsg: error,
    })
  }
})

// 查询今日的时间段报错数量

router.get('/count', async (req, res) => {
  const { id } = req.query;
  const today = new Date(); // 当前日期
  const yesterday = new Date(today); // 昨天的日期
  yesterday.setDate(yesterday.getDate() - 1); // 将日期减去1天
  const startOfToday = today.setHours(0, 0, 0, 0);

  const data = await model.count({  
      where: {
          id: {
              [Op.eq]: id
          },
          createTime: {
              [Op.between]: [startOfToday , new Date()]
          }
      },
      attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('createTime'),'%H'), 'hour']
      ],
      group: ['hour'],
  });
  console.log('data',data)
  // const sum2 = yesterdays.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
  // const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
  const todayList = [
      { time: '00', value: 0, type: 'today' },
      { time: '01', value: 0, type: 'today' },
      { time: '02', value: 0, type: 'today' },
      { time: '03', value: 0, type: 'today' },
      { time: '04', value: 0, type: 'today' },
      { time: '05', value: 0, type: 'today' },
      { time: '06', value: 0, type: 'today' },
      { time: '07', value: 0, type: 'today' },
      { time: '08', value: 0, type: 'today' },
      { time: '09', value: 0, type: 'today' },
      { time: '10', value: 0, type: 'today' },
      { time: '11', value: 0, type: 'today' },
      { time: '12', value: 0, type: 'today' },
      { time: '13', value: 0, type: 'today' },
      { time: '14', value: 0, type: 'today' },
      { time: '15', value: 0, type: 'today' },
      { time: '16', value: 0, type: 'today' },
      { time: '17', value: 0, type: 'today' },
      { time: '18', value: 0, type: 'today' },
      { time: '19', value: 0, type: 'today' },
      { time: '20', value: 0, type: 'today' },
      { time: '21', value: 0, type: 'today' },
      { time: '22', value: 0, type: 'today' },
      { time: '23', value: 0, type: 'today' },
  ];
  
  todayList.forEach((item) => {
      data.forEach(it => {
          if(item.time === it.hour){
              item.value = it.count
          }
      });
      
  });

  res.send({
      msg: '查询成功',
      data: todayList,
    })
});











// post 请求 / 路径的时候会进到这里 （实际是 http://localhost:3000/api/code/）
router.post('/', async(req, res) => {
  console.log('123')
  try {
    const data = req.body;
    console.log(data)
    const [ _, created ] = await model.findOrCreate({
      where: {
        codeName: data.codeName
      },
      defaults: { ...data }, 
      
    });
    console.log(data)
    console.log(created)
    if (created) {
      res.send({ 
        msg: '增加成功',  
      })
    } else {
      res.send({
        msg: '已经有了',
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
    const data = req.body
    console.log('数据',data)
  try {
    const result =  await model.update({
        name: data.name,
        codeName: data.codeName,
    },{
        where: { 
          id: data.codeId,
        },
    });
    console.log('结果',result)
    res.send({
        msg: '修改成功', 
        data: result,
        error: 0,

    })
  }catch (err) {
    console.log('结果',data)
      res.send({
          msg: '修改失败',
          errorMsg: err,

    })
  }
})

router.delete('/', async(req, res) => {
  const { codeId } = req.body;
  try {
      await model.destroy({
          where: {
            id: codeId,
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