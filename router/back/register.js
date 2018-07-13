var express = require('express');
var router = express.Router();
var moment = require('moment');
var crypto = require('crypto')

var UserSchema = require('../../db/schema/userSchema');
var userMod = require('../../modules/User');
var getClientIP = require('../../modules/getClientIP');


router.post('/', function (req, res) {
  /* 获取客户端ip信息 */
  var pars = {
    reg_name: req.body.reg_name,
    reg_pwd: req.body.reg_pwd,
    reg_tel: req.body.reg_tel,
    reg_permissions: req.body.reg_permissions,
    reg_userAgent: req.headers['user-agent']
  }
  userMod.createUser(req, pars, function (err, result) {
    if (err) return res.json('注册错误');
    console.log('--------用户数据已记录---------' + result);
    res.redirect('/login');
  });


})


module.exports = router;