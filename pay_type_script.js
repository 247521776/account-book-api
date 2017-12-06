const mongoose      = require('mongoose');
const config        = require("./config");
mongoose.Promise    = global.Promise;
const pay_type_data = [
    {
        name: '餐饮',
        type: 1
    },
    {
        name: '服装',
        type: 2
    },
    {
        name: '交通',
        type: 3
    },
    {
        name: '日用品',
        type: 4
    },
    {
        name: '水电',
        type: 5
    },
    {
        name: '话费',
        type: 6
    },
    {
        name: '娱乐',
        type: 7
    }
];
const pay_type      = require('./models/pay_type');

mongoose.connect(config.mongo, {useMongoClient: true})
.then(function() {
    pay_type.remove((err) => {
        if (err) return console.error('清理数据失败');
        console.log('清理数据成功');
        pay_type.insertMany(pay_type_data, (err) => {
            if(err) return console.error('初始化数据失败');
            console.log('数据初始化成功');
            pay_type.find((err, data) => {
                if (err) return console.error('查询总条数失败');
                console.log('数据总条数：', data.length);
                mongoose.connection.close();
            });
        });
    });
});