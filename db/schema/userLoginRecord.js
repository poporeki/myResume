var mongoose = require('mongoose');
var loginRecord = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'myweb_user'
  },
  login_OS: {
    name: String,
    version: String
  },
  login_browser: {
    name: String,
    version: String
  },
  login_geolocation: {
    ip: String,
    country: String,
    city: String,
    isp: String,
    region: String
  },
  login_userAgent: String
}, {
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});

var Schema = mongoose.model('user_login_record', loginRecord);
module.exports = Schema;