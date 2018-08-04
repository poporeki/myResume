var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
var articleTypeMod = require('../../modules/Article/articleType');
var arcticleTagMod = require('../../modules/Article/articleTag');

router.get('/', (req, res, next) => {
  articleTypeMod.findArticleType('', (err, resTypeList) => {
    if (err) return next(err);
    articleMod.findArticleTagsInfo((err, resTagsList) => {
      if (err) return next(err);
      var by = {
        by: {
          is_delete: false,
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
          tagList: resTagsList,
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

router.get('/info', function (req, res) {
  articleMod.findArticleTagsInfo(function (err, result) {
    if (err) {
      console.log(err);

    }
    res.send(result);
  })
})
router.use('/search', require('./search'));
router.use('/user', require('./user'));
router.use('/article', require('./article'));
router.use('/articlelist', require('./articlelist'));

router.use('/', require('./comments'));
module.exports = router;