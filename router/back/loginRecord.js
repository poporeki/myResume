const express = require('express'),
  router = express.Router();

const moment = require('moment');

const userMod = require('../../modules/User');

router.get('/', (req, res, next) => {
  userMod.findAllUserLoginRecord(20, (err, result) => {
    if (err) return next(err);
    var arr = [];
    for (var idx = 0, userLen = result.length; idx < userLen; idx++) {
      let user = result[idx];
      let country = user.login_geolocation.country ? user.login_geolocation.country : '';
      let region = user.login_geolocation.region ? user.login_geolocation.region : '';
      let city = user.login_geolocation.city ? user.login_geolocation.city : '';
      let isp = user.login_geolocation.isp ? user.login_geolocation.isp : 'NOT';
      arr.push({
        username: user.user_id.user_name || '',
        os: user.login_OS.name + user.login_OS.version,
        browser: user.login_browser.name + user.login_browser.version,
        ip: user.login_geolocation.ip,
        address: country + ' ' + region + ' ' + city,
        isp: isp,
        logtime: moment(user.create_time).format('YYYY-MM-DD hh:mm:ss:ms')
      })
    }
    res.render('./backend/userLoginRecord', {
      pageTitle: '登陆记录',
      record: arr
    });
  });

});

router.post('/', function (req, res) {
  userMod.findAllUserLoginRecord((err, result) => {
    if (err) return;

  });
});

module.exports = router;