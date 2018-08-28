const express = require('express'),
  router = express.Router();
const {
  check,
  validationResult
} = require('express-validator/check');

const uploadIMGMod = require('../../modules/uploadIMG'),
  userMod = require('../../modules/User');

router.use('/', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
})

router.get('/', (req, res) => {

  userMod.findUserById(req.session.user._id, (err, userInfo) => {
    if (err) return next(err);
    let repAvatar = userInfo.avatar_path ? userInfo.avatar_path.save_path + 'thumbnail_' + userInfo.avatar_path.new_name : "/images/my-head.png";
    let path = repAvatar;
    res.render('./blog/user', {
      username: userInfo.user_name,
      avatar: path
    });
  })

});
router.post('/uploadAvatar', (req, res, next) => {
  uploadIMGMod.baseUpload(req, '/images/upload/userAvatar/', (err, result) => {
    if (err) return next(err);
    res.json({
      status: true,
      data: {
        src: result
      }
    });
  })
});
router.post('/changeUserPassword', [
    check('new_password').isString()
    .matches(/^\S{6,20}$/).withMessage('密码格式错误，请重新输入')
  ],
  function (req, res, next) {
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
      var err = errors.array();
      var errArr = [];
      for (var i = 0; i < err.length; i++) {
        errArr.push(err[i]);
      }
      return res.json({
        status: false,
        msg: errArr
      });
    }
    userMod.updateAccountPassword({
      username: req.session.user.username,
      password: req.body.password,
      newPassword: req.body.new_password
    }, function (err, result) {
      if (err) return next(err);
      if (err || !result) {
        return res.json({
          status: false
        });
      }
      return res.json({
        status: true,
        msg: 'changed'
      })
    })
  })
module.exports = router;