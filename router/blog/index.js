var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
var commentMod = require('../../modules/Article/articleComments');
var articleTypeMod = require('../../modules/Article/articleType');
var arcticleTagMod = require('../../modules/Article/articleTag');

router.get('/', (req, res, next) => {
  var resObj = {};
  /* 获取文章分类 */
  function getArcType() {
    return new Promise(function (resolve, reject) {
      articleTypeMod.findArticleType('', (err, resTypeList) => {
        if (err) {
          reject(err);
        }
        resObj['typeList'] = resTypeList;
        resolve();
      });
    })
  }
  /* 获取文章tag标签 */
  function getArcTags() {
    return new Promise(function (resolve, reject) {
      articleMod.findArticleTagsInfo((err, resTagsList) => {
        if (err) {
          reject(err);
        }
        resObj['tagList'] = resTagsList;
        resolve();
      });
    })
  }
  /* 获取最新评论 */
  function getCommTop() {
    return new Promise(function (resolve, reject) {
      commentMod.findCommentTop(function (err, resCommList) {
        if (err) {
          reject(err);
        }
        resObj['commList'] = resCommList;
        resolve();
      })
    })
  }
  /* 获取文章列表 */
  function getArcList() {
    return new Promise(function (resolve, reject) {
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
        if (err) {
          reject(err);
        }
        resObj['carouList'] = resCarouselList;
        resolve();
      });
    })
  }
  getArcType()
    .then(getArcTags)
    .then(getCommTop)
    .then(getArcList)
    .then(() => {
      res.render('./blog/index', resObj);
    })
    .catch(err => {
      return next(err);
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

router.get('/info', (req, res) => {
  commentMod.findCommentTop((err, result) => {
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