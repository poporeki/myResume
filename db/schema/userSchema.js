var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    'serial_num': Number,
    'user_name': String,
    'password': String,
    'tel_num': Number,
    'reg_time': Date,
    'avatar_path': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'upload_file'
    },
    'permissions': String,
    'reg_ip': String,
    'reg_country': String,
    'reg_country_id': String,
    'reg_city': String,
    'reg_isp': String,
    'reg_region': String,
    'reg_user_agent': String,
    'login_time': [],
    'author_id': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myweb_user'
    }
});

userSchema.statics.findUserById = function (id, cb) {
    return this.findById(id).populate([{
        path: 'avatar_path'
    }, {
        path: 'author_id'
    }]).exec(cb);
}

userSchema.statics.findByName = function (name, cb) {
    return this.find({
        user_name: name
    }, cb);
}
userSchema.statics.findByNP = function (params, cb) {
    return this.find({
        user_name: params.name,
        password: params.pwd
    }, cb);
}
userSchema.statics.pushLoginTime = function (params, cb) {
    return this.update({
        user_name: params.name
    }, {
        $push: {
            login_time: params.time
        }
    }, cb);
}

var User = mongoose.model('myweb_user', userSchema);

module.exports = User;