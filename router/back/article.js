var express = require('express');
var router = express.Router();


var articleMod = require('../../modules/Article/article');
var articleTypeMod = require('../../modules/Article/articleType');
var articleTagMod = require('../../modules/Article/articleTag');
var uploadIMGMod = require('../../modules/uploadIMG');
router.post('/uploadArtIMG', function (req, res) {
  uploadIMGMod(req, '/images/upload/article/', function (err, result) {
    if (err) {
      return;
    }
    res.json({
      "errno": 0,
      "data": [
        result.fileUrl
      ]
    })
  })
});



/* 显示所有文章 */
router.get('/articlelist', function (req, res) {
  // articleMod.getCount({}, function (err, artCount) {
  //     if (err) return;
  //     articleMod.showArticleList(req, function (err, result) {
  //         if (err) return;
  //         res.render('./backend/articlelist', {
  //             pageTitle: "文章列表",
  //             userName: req.session.user.username,
  //             artInfo: result,
  //             artCount:artCount
  //         });
  //     })
  // })
  res.render('./backend/articlelist', {
    pageTitle: "文章列表",
    userName: req.session.user.username
  });
})
router.post('/articlelist', function (req, res) {
  articleMod.getCount(req, function (err, artCount) {
    if (err) return;
    articleMod.showArticleList(req, function (err, result) {
      if (err) return;
      res.json({
        status: 1,
        msg: '',
        data: {
          artInfo: result,
          artCount: artCount
        }
      });
    })
  })
})
router.get('/typelist', function (req, res) {
  articleTypeMod.findArticleType(req.query, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.render('./backend/articleTypeList', {
      pageTitle: '分类列表',
      userName: req.session.user.username,
      art: result
    });
  })
})
router.use('/updatearticle', require('./article_update'));
router.use('/addArticle', require('./article_add'));
router.use('/addtype', require('./article_type'));
router.use('/addtag', require('./article_tag'));
router.use('/remove', require('./article_remove'));
module.exports = router;