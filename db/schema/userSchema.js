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
  'reg_adcode': String,
  'reg_rectangle': String,
  'login_time': [],
  'author_id': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'myweb_user'
  }
}, {
  timestamps: {
    createdAt: 'create_time',
    updateAt: 'update_time'
  }
});

userSchema.statics.findUserById = function (id, cb) {
  return this.findById(id).populate([{
    path: 'avatar_path'
  }, {
    path: 'author_id'
  }]).exec(cb);
}
userSchema.statics.getUserList = function (pars, cb) {
  var pop = {
    path: 'avatar_path',
    select: 'save_path,new_name'
  };
  return this
    .find(pars.by)
    .limit(pars.limit)
    .skip(pars.skip)
    .sort(pars.sort)
    .populate(pop)
    .exec(cb);
}
userSchema.statics.findByName = function (name, cb) {
  return this.find({
    user_name: name
  }, cb);
}
userSchema.statics.findByNP = function (pars, cb) {
  return this.find({
    user_name: pars.name,
    password: pars.pwd
  }, cb);
}
userSchema.statics.updateUserPassword = function (pars, cb) {
  return this.findOneAndUpdate({
    user_name: pars.name,
    password: pars.pwd
  }, {
    $set: {
      password: pars.newPwd
    }
  }, cb);
}
userSchema.statics.pushLoginTime = function (pars, cb) {
  return this.update({
    user_name: pars.name
  }, {
    $push: {
      login_time: pars.time
    }
  }, cb);
}

var User = mongoose.model('myweb_user', userSchema);

module.exports = User;