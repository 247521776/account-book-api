const fs              = require('fs');
const join            = require('path').join;
const controllersPath = __dirname;
const router          = new require('koa-router')();
const jwt             = require("jsonwebtoken");
const md5             = require('md5');
const users           = require('../service/users');

router.post('/api/login', async (ctx) => {
    const body     = ctx.request.body;
    const username = body.username;
    let   password = body.password;
    if (username && password) {
        password = md5(password);
    }
    else {
        return ctx.body = {
            code: 401,
            msg: '请填写账号密码'
        };
    }

    try {
        const user = await users.find(username);
        const token = jwt.sign({
            username,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
        }, "woshiyang");
        if (user.password === password) {
            return ctx.body = {
                code: 200,
                token,
                msg: '登录成功'
            };
        }     
        else {
            return ctx.body = {
                code: 401,
                msg: '账号密码错误'
            };
        }  
    }
    catch(err) {
        ctx.body = {
            code: 500,
            msg: '用户登录失败'
        };
    }
});

router.post("/api/user", async (ctx) => {
    const user     = ctx.request.body || {};
    const username = user.username;
    const password = user.password;

    if (username && password) {
        ctx.body = await users.create(user);
    }
    else {
        ctx.body = {
            code: 401,
            msg: '请填写账号密码'
        };
    }
});

router.all('/api/*', async function(ctx, next) {
    const token = ctx.query.token;
    try {
        const data  = await verify(token);
        ctx.query.username = data.username;
    }
    catch(err) {
        return ctx.body = {
            code: 403,
            msg: '请登录'
        };
    }
    await next();
});

fs.readdirSync(controllersPath)
    .filter(controllerPath => ~controllerPath.search(/^[^\.].*\.js$/))
    .forEach((controllerPath) => {
        if (controllerPath !== "index.js") {
            const controller = require(join(__dirname, controllerPath));
            for (let url in controller) {
                const methods = controller[url];
                for (let method in methods) {
                    router[method](url, methods[method]);
                }
            }
        }
    });

module.exports = (app) => {

    // 优雅的异常处理
    app.use(async function(ctx, next) {
        try {
            await next();
        }
        catch(err) {
            console.log(err);
            ctx.body = {
                code: 500,
                msg: '发生错误',
                errorMsg: err
            };
        }
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
};

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "woshiyang", (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });   
}