var express = require('express');
var router = express.Router();
var TouristsMod = require('../../modules/Tourists');

router.get('/ofTheDayVistorList', function (req, res) {
  TouristsMod.getTheDayVistor(function (result) {
    res.render('./backend/vistorlist', {
      pageTitle: '今天的访问量',
      username: req.session.user.username,
      datas: result
    })
  })
});

module.exports = router;