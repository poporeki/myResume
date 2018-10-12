const express = require('express'),
  router = express.Router(),
  moment = require('moment');


var articleMod = require('../../modules/Article/article'),
  commentMod = require('../../modules/Article/articleComments'),
  articleTypeMod = require('../../modules/Article/articleType'),
  arcticleTagMod = require('../../modules/Article/articleTag'),
  weatherMod = require('../../modules/weather'),
  getIP = require('../../modules/getIP');

router.get('/', (req, res, next) => {
  let resObj = {};
  /* 获取文章分类 */
  function getArcType() {
    return new Promise((resolve, reject) => {
      articleTypeMod.findArticleType('', (err, resTypeList) => {
        if (err) return reject(err);
        resObj['typeList'] = resTypeList;
        resolve();
      });
    })
  }
  /* 获取文章tag标签 */
  function getArcTags() {
    return new Promise((resolve, reject) => {
      articleMod.findArticleTagsInfo((err, resTagsList) => {
        if (err) return reject(err);
        resObj['tagList'] = resTagsList;
        resolve();
      });
    })
  }
  /* 获取最新评论 */
  function getCommTop() {
    return new Promise((resolve, reject) => {
      commentMod.findCommentTop((err, resCommList) => {
        if (err) return reject(err);
        resObj['commList'] = resCommList;
        resolve();
      })
    })
  }
  /* 获取文章列表 */
  function getArcList() {
    return new Promise((resolve, reject) => {
      var by = {
        by: {
          is_delete: false,
          attribute: {
            carousel: true
          }
        }
      };
      req.query = by;
      articleMod.showArticleList(req, (err, result) => {
        if (err) return reject(err);
        resObj['carouList'] = result.arcList;
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
router.get('/weather', (req, res, next) => {
  let geolo = {};
  if (req.query.geolocation && req.query.geolocation !== '' && req.query.geolocation !== 'false') {
    var g = "" + req.query.geolocation;
    geolo.geolocation = g;
  } else {
    let ip = getIP(req);
    geolo.ip = ip;
  }

  weatherMod.getWeather(geolo, (err, result) => {
    return res.json(result);
  })
})
router.use('/ip', require('./ip'));
router.use('/search', require('./search')); /* 查询文章 */
router.use('/user', require('./user')); /* 用户 */
router.use('/article', require('./article')); /* 获取文章 */
router.use('/articlelist', require('./articlelist')); /* 获取文章列表 */
router.use('/getType', require('./getType')); /* 获取分类 */

router.use('/', require('./comments'));
module.exports = router;