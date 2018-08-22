const express = require('express'),
  router = express.Router(),
  moment = require('moment');
const {
  check,
  validationResult
} = require('express-validator/check');

const drawCap = require('../modules/drawCap'),
  userMod = require('../modules/User');

router.get('/', (req, res) => {
  var createCaptcha = drawCap(5);
  req.session.captcha = (createCaptcha.str).toLowerCase();
  res.render('./sign_up', {
    drawCap: createCaptcha.dataUrl
  });
});

router.post('/', [
  // username must be an email
  check('su_name').isString().withMessage('必须为字符串').isLength({
    min: 4,
    max: 12
  }).withMessage('账号长度错误')
  .matches(/^[\D]{1}([\u4e00-\u9fa5\-\w]){3,11}$/).withMessage('账号格式错误'),
  check('su_pwd').isLength({
    min: 6,
    max: 20
  }).withMessage('密码长度错误')
  .matches(/^\S{6,20}$/).withMessage('密码格式错误')
], (req, res) => {
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
  let pars = {
    reg_name: req.body.su_name,
    reg_pwd: req.body.su_pwd,
    reg_tel: req.body.su_tel,
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