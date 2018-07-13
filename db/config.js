var mongoose = require('mongoose');
var options = {
    auto_reconnect: true,
    poolSize: 10
};
mongoose.connect('mongodb://test:123456@198.148.106.33:27069/test', options,
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('successfully');
        }
    });
var db = mongoose.connection;
db.once('open', function () {
    console.log('---------database connected----------');
})


module.exports = db;