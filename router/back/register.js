const express = require('express'),
  router = express.Router(),
  moment = require('moment'),
  crypto = require('crypto');

const {
  check,
  validationResult
} = require('express-validator/check');

const UserSchema = require('../../db/schema/userSchema'),
  userMod = require('../../modules/User'),
  getClientIP = require('../../common/IPModule');


router.post('/', [
  check('reg_name')
    .isString().withMessage('账号必须为字符串')
    .isLength({
      min: 4,
      max: 12
    }).withMessage('账号长度错误')
    .matches(/^[\D]{1}([\u4e00-\u9fa5\-\w]){3,11}$/).withMessage('账号格式错误'),
  check('reg_pwd').isLength({
    min: 6,
    max: 20
  }).withMessage('密码长度错误')
    .matches(/^\S{6,20}$/).withMessage('密码格式错误')
], (req, res, next) => {
  const errorFormatter = ({
    location,
    msg,
    param,
    value,
    nestedErrors
  }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${msg}`;
  };
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.json({
      status: false,
      msg: errors.array()
    });
  }
  /* 获取客户端ip信息 */
  let pars = {
    reg_name: req.body.reg_name,
    reg_pwd: req.body.reg_pwd,
    reg_tel: req.body.reg_tel,
    reg_permissions: req.body.reg_permissions,
    reg_userAgent: req.headers['user-agent']
  }
  userMod.createUser(req, pars, function (err, result) {
    if (err) return next(err);
    console.log('--------用户数据已记录---------' + result);
    res.redirect('/login');
  });


})


module.exports = router;