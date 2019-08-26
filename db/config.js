var mongoose = require('mongoose');

const {
    HOSTNAME,
    PORT,
    DBNAME,
    USERNAME,
    USERPSWD
} = require('../config/DB_CONFIG');
mongoose.connect(`mongodb://${USERNAME}:${USERPSWD}@${HOSTNAME}:${PORT}/myBlog`, {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        console.log(`数据库连接错误：${err}`);
    } else {
        console.log('数据库连接成功');
    }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('---------database connected----------');
})


module.exports = db;