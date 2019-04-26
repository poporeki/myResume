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
  IPMod = require('../../common/IPModule');


router.post('/', [
  check('reg_name')
  .isString().withMessage('账号必须为字符串')
  .isLength({
    min: 4,
    max: 13
  }).withMessage('账号长度错误')
  .matches(/^[\D]{1}([\u4e00-\u9fa5\-\w]){3,11}$/).withMessage('账号格式错误'),
  check('reg_pwd').isLength({
    min: 6,
    max: 20
  }).withMessage('密码长度错误')
  .matches(/^\S{6,20}$/).withMessage('密码格式错误')
], async (req, res, next) => {
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
  let clientIp = await IPMod.getClientGeoloInfo(req);
  /* 获取客户端信息 */
  let pars = {
    userAgent: req.headers['user-agent'],
    ipInfo: clientIp,
    userId: req.session.user._id
  }
  //用户名
  let username = req.body.reg_name;
  //密码
  let password = req.body.reg_pwd;
  //电话
  let telnumber = req.body.reg_tel;
  //电子邮箱
  let email = req.body.reg_email;
  //出生日期
  let birth = req.body.reg_birth;
  //简介
  let desc = req.body.reg_desc;
  //权限
  let permisArr = ['normal', 'root', 'admin'];
  let permissions = req.body.reg_permissions;
  //注册人权限
  let registrant = req.session.user.permissions;
  if (registrant === 'root') {
    permissions = ['normal', 'admin'].indexOf(permissions) !== -1 ? permissions : 'normal';
  } else {
    permissions = 'normal';
  }

  // permissions = permisArr.indexOf(permissions) !== -1 ? permissions : 'normal';
  username && (pars['uname'] = username);
  password && (pars['upwd'] = password);
  telnumber && (pars['utel'] = telnumber);
  email && (pars['uemail'] = email);
  desc && (pars['udesc'] = desc);
  birth && (pars['ubirth'] = birth);
  permissions && (pars['upermissions'] = permissions);

  userMod.createUser(pars, function (err, result) {
    if (err) return next(err);
    console.log('--------用户数据已记录---------' + result);
    if (req.xhr) {
      return res.json({
        status: 1,
        msg: 'success'
      })
    }
    res.redirect('/login');
  });


})


module.exports = router;