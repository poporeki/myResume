var express = require('express');
var router = express.Router();

var articleMod = require('../../modules/Article/article');
var articleTypeMod = require('../../modules/Article/articleType');
var articleTagMod = require('../../modules/Article/articleTag');

var scriptlink = require('./arclist_script');

router.get('/', function (req, res) {
  articleTypeMod.findArticleType({}, function (err, resTypes) {
    if (err) {
      console.log(err);
      return;
    }
    articleTagMod.findArticleTags({}, function (err, resTags) {
      if (err) return;
      res.render('./backend/addArticle', {
        pageTitle: '添加文章',
        submitURL: '/backend/art/addarticle',
        userName: req.session.user.username,
        tagName: resTags,
        typeName: resTypes,
        importScript: scriptlink,
        importStyle: {
          cdn: [
            'select2/4.0.0/css/select2.min.css'
          ]
        }
      })
    })

  })

});

// 添加文章
router.post('/', function (req, res) {
  articleMod.addArticle(req, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json({
      status: true
    });
  });
})

module.exports = router;