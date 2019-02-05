var mongoose = require('mongoose');
mongoose.connect('mongodb://yanskWeb1:yansk4990@148.70.57.170:27069/myBlog', {
     useNewUrlParser: true 
    },function (err) {
        if (err) {
            console.log(`数据库连接错误：${err}`);
        } else {
            console.log('数据库连接成功');
        }
    });
var db = mongoose.connection;
db.once('open', function () {
    console.log('---------database connected----------');
})


module.exports = db;