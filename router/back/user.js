var express = require('express');
var router = express.Router();

var userMod = require('../../modules/User');
var TouristsMod = require('../../modules/Tourists');

router.get('/ofTheDayVistorList', function (req, res) {
  TouristsMod.getTheDayVistor(function (err, result) {
    res.render('./backend/vistorlist', {
      pageTitle: '今天的访问量',
      username: res.locals.USER,
      datas: result
    })
  })
});

router.get('/userlist', (req, res, next) => {
  userMod.getUserList(req.query, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render('./backend/userList', {
      pageTitle: '用户列表',
      userlist: result
    })
  });
});
module.exports = router;