var express = require('express');
var router = express.Router();

var articleTypeMod = require('../../modules/Article/articleType');

router.get('/', function (req, res) {
  res.render('./backend/addType', {
    pageTitle: '添加分类',
    userName: req.session.user.username
  });
})

router.post('/', function (req, res) {
  articleTypeMod.addArticleType(req.body, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/backend');
  })
});

module.exports = router;