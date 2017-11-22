const mongoose        = require("mongoose");
const users           = mongoose.model("account_users");

// 创建用户
exports.create = (user) => {
    const username = user.username;
    const password = user.password;
    return new Promise((resolve, reject) => {
        users.find({
            username
        }, (err, data) => {
            if (err) reject(err);
            if (data.length > 0) {
                resolve({
                    code: 401,
                    msg: '账号已存在'
                });
            }
            else {
                const user = new users({
                    username,
                    password: md5(password)
                });
                user.save((err) => {
                    if(err) reject(err);
                    resolve({
                        code: 200,
                        msg: '创建成功'
                    });
                });
            }
        });
     });
};

// 查找用户
exports.find = (username) => {
    return new Promise((resolve, reject) => {
        users.find({
            username
        }, (err, data) => {
            if (err) reject(err);
            if (data.length !== 1) reject('查找到多个用户');
            resolve(data[0]);
        });
    });
}