const mongoose        = require("mongoose");
const pay_type        = require('../models/pay_type');

exports.findAll = () => {
    return new Promise((resolve, reject) => {
        pay_type.find((err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}