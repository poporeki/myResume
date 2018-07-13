var crypto = require('crypto');
var moment = require('moment');
var dbUser = require('../db/schema/userSchema');
var getClientIP = require('./getClientIP');
var dbLoginRecord = require('../db/schema/userLoginRecord');

module.exports = {
  /* 根据id查找用户 */
  findUserById: function (id, cb) {
    dbUser.findUserById(id, cb);
  },
  /* 根据名字查找用户 */
  findUser: function (name, cb) {
    dbUser.findByName(name, cb);
  },
  /* 比对密码 */
  checkUserPwd: function (params, cb) {
    dbUser.findByNP(params, cb);
  },
  /* 创建用户 */
  createUser: function (req, pars, cb) {
    /* 解析客户端ip */
    getClientIP(req, function (result) {
      if (!result) return;
      var name = pars.reg_name;
      var pwd = pars.reg_pwd;
      var tel = pars.reg_tel || 0;
      var permissions = pars.reg_permissions || 'normal';
      var nowDate = moment().format();
      var userAgent = pars.userAent || 'not';
      var hash = crypto.createHash('md5');
      hash.update(pwd);
      pwd = hash.digest('hex');
      var ip_info = result;

      var parms = {
        serial: moment().format('YYMMDD') + 1,
        username: name,
        password: pwd,
        tel_num: tel,
        permissions: permissions,
        now_date: nowDate,
        ip_info: ip_info,
        author: req.session.user ? req.session.user._id : undefined
      };
      /* 查找注册用户名是否存在 */
      dbUser.findByName(name, function (err, result) {
        if (err || result.length != 0) return cb(1, null);
        var pars = {
          serial_num: parms.serial,
          user_name: parms.username,
          password: parms.password,
          tel_num: parms.telnumber,
          permissions: parms.permissions,
          reg_time: parms.now_date,
          reg_ip: parms.ip_info.ip,
          reg_country: parms.ip_info.country,
          reg_country_id: parms.ip_info.country_id,
          reg_city: parms.ip_info.city,
          reg_isp: parms.ip_info.isp,
          reg_region: parms.ip_info.region,
          reg_user_agent: parms.userAgent,
          author_id: parms.author
        };
        return dbUser.create(pars, cb);
      })
    });

  },
  /* 记录登陆时间 */
  pushLoginTime: function (req, userid, cb) {
    getClientIP(req, function (resIPinfo) {
      var ua = req.useragent;
      var pars = {
        user_id: userid,
        login_OS: {
          name: ua.platform,
          version: ua.os
        },
        login_browser: {
          name: ua.browser,
          version: ua.version
        },
        login_geolocation: {
          ip: resIPinfo.ip,
          country: resIPinfo.country,
          city: resIPinfo.city,
          isp: resIPinfo.isp,
          region: resIPinfo.region
        },
        login_userAgent: ua.source
      }
      dbLoginRecord.create(pars, cb);
    })
  },
  /* 查询登陆时间 */
  getLastLoginInfo: function (userid, cb) {
    dbLoginRecord.find({
      'user_id': userid
    }).sort({
      'create_time': -1
    }).limit(2).exec(function (err, result) {
      if (err && result.length === 0) return cb(err, null);
      var data = result[1];
      var lastLogin = {
        geolocation: data.login_geolocation,
        os: data.login_OS,
        login_time: moment(data.create_time).format('YYYY-MM-DD hh:mm:ss')
      }
      dbLoginRecord.find({
        'user_id': userid
      }).count().exec(function (err, total) {
        if (err) return cb(err, null);
        lastLogin['loginTotal'] = total;
        return cb(null, lastLogin);
      });
    })

  },
  findUserLoginRecordByName: function (username, cb) {
    dbUser.findByName(username, function (err, result) {
      if (err) return;
      var userID = result[0]._id;
    })
    dbLoginRecord.find({
      'user_id': userID
    }, cb);
  },
  findAllUserLoginRecord: function (cb) {
    dbLoginRecord.find({}).populate({
      path: 'user_id'
    }).exec(cb);
  }

}