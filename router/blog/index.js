var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
var articleTypeMod = require('../../modules/Article/articleType');
var arcticleTagMod = require('../../modules/Article/articleTag');
/* router.use('/', function (req, res, next) {
  if (!req.session.user || !req.session.user.username) {
    res.redirect('/login');
    return;
  };
  next();
}) */

router.get('/', function (req, res, next) {
  articleMod.showArticleList(req, function (err, resListSortTime) {
    if (err) return next(err);
    articleTypeMod.findArticleType('', function (err, resTypeList) {
      if (err) return next(err);
      arcticleTagMod.findArticleTags('', function (err, resTagList) {

        if (err) return next(err);
        var by = {
          by: {
            attribute: {
              carousel: 'on'
            }
          }
        };
        req.query = by;
        articleMod.showArticleList(req, function (err, resCarouselList) {
          if (err) return next(err);
          res.render('./blog/index', {
            artList: resListSortTime,
            typeList: resTypeList,
            tagList: resTagList,
            carouList: resCarouselList
          });
        })

      });

    })

  })
});
router.use('/search', require('./search'));
router.use('/article', require('./article'));
router.use('/articlelist', require('./articlelist'));
router.use('/', require('./comments'));
module.exports = router;