const express = require('express'),
  router = express.Router();
const {
  check,
  validationResult
} = require('express-validator/check');

const uploadIMGMod = require('../../../modules/uploadIMG'),
  userMod = require('../../../modules/User');

const User = require('../../../controllers/user.js');

const Article = require('../../../controllers/user');

router.use('/', Article.isLogin);

router.post('/uploadAvatar', Article.updateAvatar);
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

router.post('/updateAccountInfo', User.updateInfo);
module.exports = router;