const express = require('express'),
  router = express.Router();

const articleMod = require('../../modules/Article/article'),
  articleTypeMod = require('../../modules/Article/articleType'),
  articleTagMod = require('../../modules/Article/articleTag');

const scriptlink = require('./arclist_script');

router.get('/', function (req, res) {
  let renObj = {
    pageTitle: '添加文章',
    submitURL: '/backend/art/addarticle',
    userName: req.session.user.username,

    importScript: scriptlink,
    importStyle: {
      cdn: [
        'select2/4.0.0/css/select2.min.css'
      ]
    }
  }
  /* 获取分类 */
  let getArcType = () => {
    return new Promise((resolve, reject) => {
      articleTypeMod.findArticleType({}, function (err, result) {
        if (err) reject(err);
        renObj['typeName'] = result;
        resolve();
      });
    })
  }
  /* 获取tag标签 */
  let getArcTags = () => {
    return new Promise((resolve, reject) => {
      articleTagMod.findArticleTags({}, function (err, result) {
        if (err) reject(err);
        renObj['tagName'] = result;
        resolve()
      })
    })
  }
  getArcType()
    .then(getArcTags)
    .then(() => {
      res.render('./backend/addArticle', renObj);
    })
    .catch(() => {
      return next(err);
    })


});

// 添加文章
router.post('/', (req, res, next) => {
  articleMod.addArticle(req, (err, result) => {
    if (err) {
      res.json({
        status: false
      });
      return next(err);
    }
    res.json({
      status: true
    });
  });
})

module.exports = router;