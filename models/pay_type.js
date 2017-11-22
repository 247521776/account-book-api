const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payType = new Schema({
    name: String,
    type: Number
});
module.exports = mongoose.model("account_pay_type", payType);