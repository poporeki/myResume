var express = require('express');
var router = express.Router();

var userMod = require('../../modules/User');

router.get('/', function (req, res) {
  userMod.findAllUserLoginRecord(function (err, result) {
    if (err) return;
    res.render('./backend/userLoginRecord', {
      pageTitle: '登陆记录',
      record: result
    });
  });

});

router.post('/', function (req, res) {
  userMod.findAllUserLoginRecord(function (err, result) {
    if (err) return;

  });
});

module.exports = router;