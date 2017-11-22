const koa         = require('koa');
const app         = new koa();
const koaBody     = require('koa-body');
const mongoose    = require('mongoose');
const fs          = require('fs');
const join        = require('path').join;
const modelPath   = join(__dirname + '/models');
const config      = require("./config");
mongoose.Promise  = global.Promise;

app.use(koaBody());

// 挂在所有集合
fs.readdirSync(modelPath)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(modelPath, file)));

// 连接数据库
mongoose.connect(config.mongo, {useMongoClient: true})
    .then(function(db) {
        // 添加所有路由
        require("./controllers")(app);
        const port = 2828;
        app.listen(port);
        console.log('启动端口：', port);
        console.log("启动成功");
    });