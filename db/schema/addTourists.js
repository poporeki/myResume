var mongoose = require('mongoose');
var moment = require('moment');

var userSchema = new mongoose.Schema({
  permissions: String,
  reg_ip: String,
  reg_user_agent: String,
  coming_time: Date,
  host: String
}, {
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});

userSchema.statics.findWeek = function (cb) {
  var nowDay = moment().format();
  var sevenDaysAgo = moment().subtract(7, 'days').format();
  var reg = new RegExp('/[' + nowDay - +'][' + nowDay - +']/')
  return this.find({
    coming_time: {
      "$gte": sevenDaysAgo,
      "$lt": nowDay
    }
  }, cb);
}
userSchema.statics.visitorTotalOfTheDay = function (reg, cb) {
  var zero = new Date(reg + ' 00:00:00').toISOString();
  this.find({
    create_time: {
      "$gte": new Date(reg + ' 00:00:00').toISOString(),
      "$lt": new Date(reg + ' 24:00:00').toISOString()
    }
  }).countDocuments().exec(cb);
}

userSchema.statics.visitorTotalOfTheWeek = function (reg, cb) {
  return this.find({
    coming_time: reg
  }).countDocuments().exec(cb);
}
userSchema.statics.visitorOfTheDay = function (reg, cb) {
  return this.find({
    create_time: {
      "$gte": new Date(reg + ' 00:00:00').toISOString(),
      "$lt": new Date(reg + ' 24:00:00').toISOString()
    }
  }, cb);
}

var User = mongoose.model('touristsTB', userSchema);

module.exports = User;