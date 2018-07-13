var express = require('express');
var router = express.Router();
var moment = require('moment');

var drawCap = require('../modules/drawCap');
var userMod = require('../modules/User');

router.get('/', function (req, res) {
  var createCaptcha = drawCap(5);
  req.session.captcha = (createCaptcha.str).toLowerCase();
  res.render('./sign_up', {
    drawCap: createCaptcha.dataUrl
  });
});

router.post('/', function (req, res) {
  var pars = {
    reg_name: String(req.body.su_name),
    reg_pwd: String(req.body.su_pwd),
    reg_tel: parseInt(req.body.su_tel),
    reg_permissions: 'normal',
    reg_date: moment().format(),
    reg_userAgent: req.headers['user-agent']
  }
  userMod.createUser(req, pars, function (err, result) {
    if (err) {
      return req.json({
        status: false,
        msg: '错误信息，不能注册'
      });
    }
    res.json({
      status: true,
      msg: ''
    })
  })
});
module.exports = router;