const express = require('express'),
  router = express.Router();

const userMod = require('../../modules/User'),
  TouristsMod = require('../../modules/Tourists');

router.get('/ofTheDayVistorList', (req, res) => {
  TouristsMod.getTheDayVistor((err, result) => {
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