const express = require('express'),
  router = express.Router(),
  crypto = require('crypto'),
  moment = require('moment');

const userMod = require('../modules/User');

router.get('/', function (req, res) {
  res.render('login');
})

router.post('/', function (req, res, next) {
  var name = req.body.uname;
  var pwd = req.body.upwd || '';
  var hash = crypto.createHash('md5').update(pwd).digest('hex');
  pwd = hash;
  let comPwd = () => {
    return new Promise((resolve, reject) => {
      userMod.checkUserPwd({
        name: name,
        pwd: pwd
      }, (err, result) => {
        if (err) {
          return res.json({
            status: false,
            msg: '服务器错误'
          })
        }
        if (result === 0 || !result) {
          return res.json({
            status: false,
            msg: '账号或密码错误'
          })
        }
        resolve(result);
      })
    })
  }
  /* 记录登陆信息 */
  let pushLoginRecord = (user) => {
    return new Promise((resolve, rejecet) => {
      userMod.pushLoginTime(req, user.user_id, function (err, result) {
        if (err) return reject(err);
        let per = user.permissions;
        let jumpPath = '';
        let obj = {
          username: name,
          permissions: per,
          avatarPath: user.avatar_path,
          _id: result.user_id
        }
        req.session.user = obj;
        switch (per) {
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
        resolve(jumpPath);
      })
    })
  }
  comPwd()
    .then(pushLoginRecord)
    .then((jumpPath) => {
      return res.json({
        status: true,
        msg: "登录成功",
        href: jumpPath
      });
    })
    .catch(err => next(err));
})

module.exports = router;