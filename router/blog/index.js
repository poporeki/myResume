var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
var articleTypeMod = require('../../modules/Article/articleType.js');
router.use('/', function (req, res, next) {
  if (!req.session.user || !req.session.user.username) {
    res.redirect('/login');
    return;
  };
  next();
})

router.get('/', function (req, res) {
  articleMod.showArticleList(req, function (err, resListSortTime) {
    if (err) return;
    articleTypeMod.findArticleType('', function (err, typelist) {
      if (err) return;
      console.log(typelist);
      res.render('./blog/index', {
        artList: resListSortTime,
        typeList: typelist
      });
    })

  })
});
router.use('/search', require('./search'));
router.use('/article', require('./article'));
router.use('/articlelist', require('./articlelist'));
router.use('/', require('./comments'));
module.exports = router;