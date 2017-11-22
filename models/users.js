const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema({
    username: String,
    password: String
});
mongoose.model("account_users", users);