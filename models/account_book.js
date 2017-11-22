const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountBook = new Schema({
    username: String,
    year: String,
    month: String,
    amount: Number,
    pay_type: String,
    date: String
});
mongoose.model("account_books", accountBook);