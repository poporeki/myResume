var express = require('express');
var router = express.Router();
var moment = require('moment');
var crypto = require('crypto')

var UserSchema = require('../../db/schema/userSchema');
var userMod = require('../../modules/User');
var getClientIP = require('../../modules/getClientIP');


router.post('/', function (req, res) {
  /* 获取客户端ip信息 */
  getClientIP(req, function (result) {
    if (!result) return;
    var name = String(req.body.reg_name);
    var pwd = String(req.body.reg_pwd);
    var tel = Number(req.body.reg_tel) || 0;
    var permissions = req.body.reg_permissions || 'normal';
    var nowDate = moment().format();
    var userAgent = req.headers['user-agent'] || 'not';
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
    userMod.createUser(parms, function (err, result) {
      if (err) return res.json('用户名已存在');
      console.log('--------数据已记录-----------' + result);
      res.redirect('/login');
    });
  })


})


module.exports = router;