var express = require('express');

var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var userMod = require('../modules/User');
router.get('/', function (req, res) {
  res.render('login');
})

router.post('/', function (req, res) {
  var name = req.body.uname;
  var pwd = req.body.upwd || '';
  var hash = crypto.createHash('md5');
  hash.update(pwd);
  pwd = hash.digest('hex');
  userMod.checkUserPwd({
    name: name,
    pwd: pwd
  }, function (err, result) {
    if (err || result.length === 0) {
      return res.json({
        status: false,
        msg: '账号或密码错误'
      });
    };
    userMod.pushLoginTime({
      name: name,
      time: moment().format()
    }, function (err, results) {
      if (err) return;
    })
    var per = result[0].permissions;
    if (per == 'admin') {
      req.session.user = {
        permissions: 'admin',
        username: name,
        _id: result[0]._id
      }
      res.json({
        status: true,
        msg: "登录成功",
        href: '/backend'
      });
    } else if (per == 'normal') {
      req.session.user = {
        permissions: 'normal',
        username: name,
        _id: result[0]._id
      }
      res.json({
        status: true,
        msg: "登录成功",
        href: '/blog'
      });
    }
  })
})

module.exports = router;