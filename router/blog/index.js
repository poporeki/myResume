var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
var articleTypeMod = require('../../modules/Article/articleType');
var arcticleTagMod = require('../../modules/Article/articleTag');
/* router.use('/',  (req, res, next) {
  if (!req.session.user || !req.session.user.username) {
    res.redirect('/login');
    return;
  };
  next();
}) */

router.get('/', (req, res, next) => {
  articleTypeMod.findArticleType('', (err, resTypeList) => {
    if (err) return next(err);
    arcticleTagMod.findArticleTags('', (err, resTagList) => {
      if (err) return next(err);
      var by = {
        by: {
          attribute: {
            carousel: true
          }
        }
      };
      req.query = by;
      articleMod.showArticleList(req, (err, resCarouselList) => {
        if (err) return next(err);
        res.render('./blog/index', {
          typeList: resTypeList,
          tagList: resTagList,
          carouList: resCarouselList
        });
      })

    });

  })
});

router.get('/getArtList', (req, res, next) => {
  req.query.by ? req.query.by['is_delete'] = false : req.query['by'] = {
    'is_delete': false
  }
  articleMod.showArticleList(req, (err, resListSortTime) => {
    if (err) {
      next(err);
    }
    res.json({
      status: true,
      msg: '',
      data: resListSortTime
    })
  });
})
router.use('/search', require('./search'));
router.use('/user', require('./user'));
router.use('/article', require('./article'));
router.use('/articlelist', require('./articlelist'));

router.use('/', require('./comments'));
module.exports = router;