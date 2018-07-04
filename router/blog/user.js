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
    var path = userInfo.avatar_path ? userInfo.avatar_path.source_name : "/images/my-head.png"
    res.render('./blog/user', {
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
module.exports = router;