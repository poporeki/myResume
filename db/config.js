var mongoose = require('mongoose');
var options = {
    auto_reconnect: true,
    poolSize: 10
};
mongoose.connect('mongodb://yanskWeb1:yansk4990@148.70.57.170:27069/myBlog', options,
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