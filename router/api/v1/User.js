const express = require('express'),
  router = express.Router();
const {
  check,
  validationResult
} = require('express-validator/check');

const uploadIMGMod = require('../../../modules/uploadIMG'),
  userMod = require('../../../modules/User');

router.use('/', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
})

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
  (req, res, next) => {
    const errorFormatter = ({
      msg
    }) => `${msg}`;
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.json({
        status: false,
        msg: errors.array()
      });
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
  })
module.exports = router;