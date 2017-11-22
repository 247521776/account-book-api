const pay_type = require('../service/pay_type');

module.exports = {
    '/api/pay_type': {
        async get(ctx, next) {
            const data = await pay_type.findAll();
            ctx.body = {
                code: 200,
                data,
                msg: '查询成功'
            };
        }
    }
}