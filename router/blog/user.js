var express = require('express');
var router = express.Router();

var uploadIMGMod = require('../../modules/uploadIMG');
var userMod = require('../../modules/User');

router.use('/', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
})

router.get('/', function (req, res) {

  userMod.findUserById(req.session.user._id, function (err, userInfo) {
    if (err) return;
    var repAvatar = userInfo.avatar_path ? userInfo.avatar_path.save_path + 'thumbnail_' + userInfo.avatar_path.new_name : "/images/my-head.png";
    var path = repAvatar;
    res.render('./blog/user', {
      username: userInfo.user_name,
      avatar: path
    });
  })

});
router.post('/uploadAvatar', function (req, res) {
  uploadIMGMod.baseUpload(req, '/images/upload/userAvatar/', function (err, result) {
    if (err) {
      return;
    }
    res.json({
      status: true,
      data: {
        src: result
      }
    });
  })
});
router.post('/changeUserPassword', function (req, res, next) {
  userMod.updateAccountPassword({
    username: req.session.user.username,
    password: req.body.password,
    newPassword: req.body.new_password
  }, function (err, result) {
    if (err) {
      return next(err);
    }
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