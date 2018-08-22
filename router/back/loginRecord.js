const express = require('express'),
  router = express.Router();

const userMod = require('../../modules/User');

router.get('/', (req, res, next) => {
  userMod.findAllUserLoginRecord((err, result) => {
    if (err) return next(err);
    res.render('./backend/userLoginRecord', {
      pageTitle: '登陆记录',
      record: result
    });
  });

});

router.post('/', function (req, res) {
  userMod.findAllUserLoginRecord((err, result) => {
    if (err) return;

  });
});

module.exports = router;