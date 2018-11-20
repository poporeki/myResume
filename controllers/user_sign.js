const moment = require('moment')
const crypto = require('crypto');

const drawCap = require('../common/drawCap');
const userMod = require('../modules/User');
const IPMod = require('../common/IPModule');
const common = require('../common/common.js');


const {
  check,
  body,
  validationResult
} = require('express-validator/check');


//显示登录页面
exports.showSignIn = (req, res, next) => {
  res.render('login');
}
// 显示注册页面
exports.showSignUp = (req, res, next) => {
  var createCaptcha = drawCap(5);
  req.session.captcha = (createCaptcha.str).toLowerCase();
  res.render('./sign_up', {
    drawCap: createCaptcha.dataUrl
  });
}

//登录
exports.signInCheck = [
  check('uname').isString().withMessage('必须为字符串').isLength({
    min: 4,
    max: 12
  }).withMessage('账号长度错误')
    .matches(/^[\D]{1}([\u4e00-\u9fa5\-\w]){3,11}$/).withMessage('账号格式错误'),
  check('upwd').isLength({
    min: 6,
    max: 20
  }).withMessage('密码长度错误')
    .matches(/^\S{6,20}$/).withMessage('密码格式错误')
];
exports.signIn = (req, res, next) => {
  //表单效验-错误处理
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      status: false,
      msg: errors.array()
    });
  }
  let name = req.body.uname;
  let pwd = req.body.upwd;
  let hash = crypto.createHash('md5').update(pwd).digest('hex');
  pwd = hash;
  //比对账号和密码
  let comPwd = () => {
    return new Promise((resolve, reject) => {
      userMod.checkUserPwd({ name, pwd }, (err, result) => {
        if (err) return reject(-1);
        if (result === 0 || !result) return reject(0);
        resolve(result);
      })
    })
  }
  // 记录登陆信息
  let pushLoginRecord = async (user) => {
    let ua = req.useragent;
    let ClientGeolo = await IPMod.getClientGeoloInfo(req);

    return new Promise((resolve, rejecet) => {
      userMod.pushLoginTime(user.user_id, ua, ClientGeolo, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  let fn = async () => {
    let resultCheck = await comPwd();
    await pushLoginRecord(resultCheck);
    let permissions = resultCheck.permissions;
    let jumpPath = '';
    let obj = {
      username: name,
      permissions: permissions,
      avatarPath: resultCheck.avatar_path,
      _id: resultCheck.user_id
    }
    // session记录用户
    req.session.user = obj;
    switch (permissions) {
      case 'admin':
        jumpPath = '/backend';
        break;
      case 'normal':
        jumpPath = '/blog';
        break;
      default:
        jumpPath = '/blog';
        break;
    }
    return res.json({
      status: true,
      msg: "登录成功",
      href: jumpPath
    });
  }
  fn().catch(err => {
    if (err === 0) {
      return res.json({
        status: 0,
        msg: '服务器错误'
      })
    }
    if (err === -1) {
      return res.json({
        status: -1,
        msg: '账号或密码错误'
      })
    }
    return res.json({
      status: 0,
      msg: '未知错误'
    })
  })

}

exports.signUp = (req, res, next) => {
  const errors = validationResult(req).formatWith(common.errorFormatter);
  if (!errors.isEmpty()) {
    return res.json({
      status: false,
      msg: errors.array()
    });
  }
  let createUser = (pars) => {
    return new Promise((resolve, reject) => {
      userMod.createUser(pars, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  let fn = async () => {
    let clientIp = await IPMod.getClientGeoloInfo(req);
    let pars = {
      uname: req.body.uname,
      upwd: req.body.upwd,
      utel: req.body.utel,
      upermissions: 'normal',
      udate: moment().format(),
      userAgent: req.headers['user-agent'],
      ipinfo: clientIp
    }
    await createUser(pars);
    return res.json({
      status: 1,
      msg: '注册成功'
    })
  }
  fn().catch(err => {
    return res.json({
      status: 0,
      msg: "系统错误"
    })
  })
}