var express = require('express');
var router = express.Router();

var userMod = require('../../modules/User');
var Tourists = require('../../modules/Tourists');

router.use('/', function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  if ((req.session.user.permissions != 'admin') || !req.session.user.username) {
    res.redirect('/blog');
  }
  next();


})
router.get('/', function (req, res) {
  var nowUser = req.session.user ? req.session.user.username : 'test';
  userMod.returnLoginTime(nowUser, function (aLoginTime) {
    Tourists.getTheDayVistor(function (vistor) {
      res.render('./backend/index', {
        pageTitle: '首页',
        userName: req.session.user.username,
        loginNum: aLoginTime.length,
        lastLogTime: aLoginTime[aLoginTime.length - 2],
        vistorNum: vistor.length
      });
    });

  })

})
router.get('/logout', function (req, res) {
  req.session.user = null;
  return res.redirect('/login');
});
router.get('/regg', function (req, res) {
  res.render('./backend/regAdmin', {
    pageTitle: '注册',
    userName: req.session.user ? req.session.user.username : ''
  });
});
/* router.use('/upload', require('../../modules/uploadIMG')); */
router.use('/art', require('./article'));
router.use('/regg', require('./register'));
router.use('/user', require('./user'));
module.exports = router;