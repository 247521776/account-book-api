const mongoose        = require("mongoose");
const book            = mongoose.model("account_books");

exports.find = (options) => {
    const username = options.username || '',
          year     = options.year,
          month    = options.month,
          date     = options.date,
          limit    = +options.limit || 10,
          offet    = ((options.page || 1) - 1) * limit;

    return new Promise((resolve, reject) => {
        let option = {
            username,
            year,
            month,
            date
        };
        option = JSON.parse(JSON.stringify(option));
        book.find(option, {
            amount: 1,
            pay_type: 1,
            date: 1
        })
        .limit(limit)
        .skip(offet)
        .exec((err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
};

exports.add = (options) => {
    return new Promise((resolve, reject) => {
        const newBook = new book(options);
        newBook.save((err) => {
            if (err) return reject(err);
            resolve({
                username: 'yanglei'
            });
        });
    });
};

exports.count = (options) => {
    options = JSON.parse(JSON.stringify(options));
    return new Promise((resolve, reject) => {
        book.count(options, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
};