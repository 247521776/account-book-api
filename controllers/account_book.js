const book     = require('../service/account_book');
const pay_type = require('../service/pay_type');
const moment   = require('moment');

module.exports = {
    '/api/account_book' : {
        async get(ctx) {
            const query    = ctx.query,
                  username = query.username,
                  year     = query.year,
                  month    = query.month,
                  limit    = query.limit,
                  date     = query.date ? moment(query.date).format('YYYY-MM-DD') : undefined,
                  page     = query.page;
            try {
                let options = {
                    username,
                    year,
                    month,
                    limit,
                    page,
                    date
                };
                options = JSON.parse(JSON.stringify(options));
                const data  = await book.find(options);
                const pay_types = await pay_type.findAll();
                // 消费类型信息
                const config_pay_type = {};

                for (let item of pay_types) {
                    config_pay_type[item.type] = item.name;
                }

                // 格式化时间
                for (let item of data) {
                    item.date     = moment(item.date).format('YYYY-MM-DD');
                    item.pay_type = config_pay_type[item.pay_type] || item.pay_type;
                }

                const count = await book.count({
                    username,
                    year,
                    month,
                    date
                });

                ctx.body = {
                    code: 200,
                    msg: '查询成功',
                    data,
                    count
                };
            }
            catch(err) {
                ctx.body = {
                    code: 400,
                    msg: '请求失败，请重试'
                };
            }
        },
        async post(ctx) {
            const body     = ctx.request.body;
            const username = ctx.query.username;
            const date     = new Date();
            const year     = date.getFullYear();
            const month    = date.getMonth() + 1;
            const today    = moment(date).format('YYYY-MM-DD');
            const amount   = body.amount;
            const pay_type = body.pay_type;

            await book.add({
                username,
                year,
                month,
                date: today,
                amount,
                pay_type
            });

            ctx.body = {
                code: 200,
                msg: '新账添加成功'
            };
        }
    }
};