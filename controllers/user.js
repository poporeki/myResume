const uploadIMGMod = require('../modules/uploadIMG'),
  userMod = require('../modules/User');

var validator = require('validator');
const {
  check,
  validationResult
} = require('express-validator/check');

const sign = require('./user_sign.js');

/**判断登录状态 跳转登录页 */
exports.isLogin = (req, res, next) => {
  if (!req.session.user) next(-9);
  next();
}
/**更新用户头像 */
exports.updateAvatar = (req, res, next) => {
  if (!req.session.user || !req.body.imgBase) {
    return res.json({
      status: false,
      msg: '失败'
    })
  }
  //用户id
  let userid = req.session.user._id;
  //图片数据
  let base = req.body.imgBase;
  uploadIMGMod.baseUpload(userid, base, '/images/upload/userAvatar/', (err, result) => {
    if (err) {
      return res.json({
        status: false,
        msg: '失败'
      })
    };
    res.json({
      status: true,
      data: {
        src: result
      }
    });
  })
}
/**显示用户页 */
exports.showUserHome = (req, res, next) => {
  function avatarFn(avatar) {
    if (avatar) {
      if (avatar.has_thumbnail) {
        return avatar.save_path + 'thumbnail_' + avatar.new_name;
      }
      return avatar.save_path + avatar.new_name;
    }
    return '';
  }
  //获取用户信息
  let getUserInfo = () => {
    return new Promise((resolve, reject) => {
      userMod.findUserById(req.session.user._id, (err, userInfo) => {
        if (err) return reject(err);
        let avatarPath = avatarFn(userInfo.avatar_path);
        resolve({
          username: userInfo.user_name || '',
          avatar: avatarPath,
          email: userInfo.email || '',
          telnumber: userInfo.tel_number || ''
        })
      })
    })
  }
  getUserInfo().then(result => {
    if (req.baseUrl.indexOf('api') !== -1) {
      return res.json({
        status: true,
        data: result
      })
    }
    res.render('./blog/user', result);
  }).catch((err) => {
    next(err);
  })
}
exports.updateInfoCheck = [
  check('uname')
  .isString().withMessage('必须为字符串')
  .isLength({
    min: 4,
    max: 12
  }).withMessage('账号长度错误')
  .matches(/^[\D]{1}([\u4e00-\u9fa5\-\w]){3,11}$/).withMessage('账号格式错误')
];

/**
 * 更改用户信息
 */
exports.updateInfo = (req, res, next) => {
  //用户名
  let username = req.body.username;
  //手机号
  let telnumber = req.body.telnumber;
  //电子邮件
  let email = req.body.email;
  if (typeof username !== 'undefined' && !validator.matches(username, /^[\D]{1}([\u4e00-\u9fa5\-\w]){3,11}$/)) {
    return res.json({
      status: 0,
      msg: '用户名格式不正确'
    })
  }
  if (typeof telnumber !== 'undefined' && !validator.isMobilePhone(telnumber, ['zh-CN'])) {
    return res.json({
      status: 0,
      msg: '手机号码格式不正确'
    })
  }
  if (typeof email !== 'undefined' && !validator.isEmail(email)) {
    return res.json({
      status: 0,
      msg: '邮箱格式不正确'
    })
  }
  /**检查数据库是否存在此用户名 */
  let checkUserToDB = () => {
    return new Promise((resolve, reject) => {
      userMod.findUser(username, (err, result) => {
        if (err || result.length === 0) return resolve(false);
        resolve(true);
      })
    })
  }
  //用户id
  let userid = req.session.user._id;
  let fn = async () => {
    let nameIsExists = await checkUserToDB();
    if (nameIsExists) {
      return res.json({
        status: 0,
        msg: '用户名已存在'
      })
    }
    try {
      await userMod.updateAccountInfo(userid, {
        username,
        telnumber,
        email
      });
      return res.json({
        status: 1,
        msg: "修改成功"
      })
    } catch (error) {
      return res.json({
        status: 0,
        msg: '修改失败'
      })
    }
  }
  fn();
}
/**
 * 更改用户密码
 */
exports.updateUserPassword = (req, res, next) => {
  //新密码
  let newPwd = req.body.new_password;
  //效验格式
  if (!validator.matches(newPwd, /^\S{6,20}$/)) {
    return res.json({
      status: 0,
      msg: '密码格式错误，请重新输入'
    })
  }
  userMod.updateAccountPassword({
    username: req.session.user.username,
    password: req.body.password,
    newPassword: req.body.new_password
  }, (err, result) => {
    if (err) return next(err);
    if (err || !result) {
      return res.json({
        status: 0,
        msg: '更改失败'
      });
    }
    return res.json({
      status: 1,
      msg: 'changed'
    })
  })
}
exports.sign = sign;

exports.logout = (req, res) => {
  req.session.destroy();
  if (req.xhr) {
    return res.json({
      status: true
    })
  }
  res.redirect('/');
}

exports.auth = (req, res) => {
  var auth = {
    status: false
  };
  if (req.session.user) {
    auth.status = true;
    auth.info = {
      user: req.session.user
    }
  }
  res.json({
    auth
  });
}