const { Op, Sequelize } = require('sequelize');
const router = require('express').Router();
const model = require('../models/detail');
/**查询报错列表 */
router.get('/', async (req, res) => {
    console.log(req.query)
    const { codeId, msg, endDate, startDate } = req.query;
    const where = {}
    msg && (where['msg'] = {
        [Op.like]: `%${msg}%`
    });
    startDate && endDate && (where['createTime'] = {
        [Op.between]: [startDate, endDate] 
    });
    codeId && (where['codeId'] = {
        [Op.eq]: codeId
    });

    console.log(123, where)


    const data = await model.findAndCountAll({
        where,
        // where: {
        //     codeId: {
        //         [Op.eq]: codeId,
        //     },
        //     createTime: {
        //         [Op.between]: [startTime, endTime] 
        //     },
        //    msg: {
        //     [Op.like]: `%${msg}%`
        //    }
        // }
    });
    res.json(data);
}); 

/**查询时间段的报错数量 */
router.get('/count', async (req, res) => {
    const {codeId, startDate, endDate } = req.query;
    const today = new Date(); // 当前日期
    const yesterday = new Date(today); // 昨天的日期
    yesterday.setDate(yesterday.getDate() - 1); // 将日期减去1天
    const startOfToday = today.setHours(0, 0, 0, 0);
    const startOfYesterday = yesterday.setHours(0, 0, 0, 0); // 昨天的开始时间
    const endOfYesterday = yesterday.setHours(23, 59, 59, 999); // 昨天的结束时间
    console.log(today,yesterday,startOfYesterday,endOfYesterday)

    const data = await model.count({
        where: {
            codeId: {
                [Op.eq]: codeId
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
    const yesterdays = await model.count({
        where: {
            codeId: {
                [Op.eq]: codeId
            },
            createTime: {
                [Op.gte]: startOfYesterday, // 大于等于昨天的开始时间
                [Op.lt]: endOfYesterday, // 小于昨天的结束时间
            }
        }, 
        attributes: [
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('createTime'),'%H'), 'hour']
        ],
        group: ['hour'], 
    });
    console.log('yesterday',yesterdays)
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
    const yesterdayList = [
        { time: '00', value: 0, type: 'yesterday' },
        { time: '01', value: 0, type: 'yesterday' },
        { time: '02', value: 0, type: 'yesterday' },
        { time: '03', value: 0, type: 'yesterday' },
        { time: '04', value: 0, type: 'yesterday' },
        { time: '05', value: 0, type: 'yesterday' },
        { time: '06', value: 0, type: 'yesterday' },
        { time: '07', value: 0, type: 'yesterday' },
        { time: '08', value: 0, type: 'yesterday' },
        { time: '09', value: 0, type: 'yesterday' },
        { time: '10', value: 0, type: 'yesterday' },
        { time: '11', value: 0, type: 'yesterday' },
        { time: '12', value: 0, type: 'yesterday' },
        { time: '13', value: 0, type: 'yesterday' },
        { time: '14', value: 0, type: 'yesterday' },
        { time: '15', value: 0, type: 'yesterday' },
        { time: '16', value: 0, type: 'yesterday' },
        { time: '17', value: 0, type: 'yesterday' },
        { time: '18', value: 0, type: 'yesterday' },
        { time: '19', value: 0, type: 'yesterday' },
        { time: '20', value: 0, type: 'yesterday' },
        { time: '21', value: 0, type: 'yesterday' },
        { time: '22', value: 0, type: 'yesterday' },
        { time: '23', value: 0, type: 'yesterday' },
    ];
    todayList.forEach((item) => {
        data.forEach(it => {
            if(item.time === it.hour){
                item.value = it.count
            }
        });
        
    });
    yesterdayList.forEach((item) => {
        yesterdays.forEach(it => {
            if(item.time === it.hour){
                item.value = it.count
            }
        });
        
    });
    //   console.log(todayList,yesterdayList)
      const final = [...todayList,...yesterdayList]
    res.send({
        msg: '查询成功',
        data: final,
        // today: sum,
        // yesterdayCount: sum2
      })
});


router.post('/ ',async(req,res) => {
    try {
        const data = req.body;
        const result = await model.create({ ...data })
        res.send({ msg: '新增成功'})
    }catch(err){
        console.log(err)
    }
    
})

module.exports = router 