var express = require('express');
var router = express.Router();

var articleTagMod = require('../../modules/Article/articleTag');

router.get('/', function (req, res) {
  res.render('./backend/addTag', {
    pageTitle: '添加Tag标签',
    userName: req.session.user.username
  })
})
router.post('/', function (req, res) {
  articleTagMod.addArticleTag(req.body, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/backend');
  })
})

module.exports = router;