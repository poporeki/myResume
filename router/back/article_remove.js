var express = require('express');
var router = express.Router();

var arcMod = require('../../modules/Article/article');

router.post('/', function (req, res) {
  if (req.session.user.permissions !== 'admin') {
    return res.json({
      status: 0,
      msg: '没有此操作权限'
    })
  }
  arcMod.removeArticle(req.body.artid, function (err, result) {
    if (err) return;
    res.json({
      status: 1,
      msg: ''
    })
  })
});

module.exports = router;