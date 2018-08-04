var express = require('express');
var router = express.Router();

var arcMod = require('../../modules/Article/article');
var arcTypeMod = require('../../modules/Article/articleType');
var arcTagMod = require('../../modules/Article/articleTag');

var scriptlink = require('./arclist_script');
/* 修改文章 */
router.get('/:artid', function (req, res) {
  arcMod.showOneArticle(req.params.artid, function (err, artInfo) {
    if (err) return;
    var artInfo = artInfo[0];
    arcTypeMod.findArticleType({}, function (err, typeInfo) {
      arcTagMod.findArticleTags({}, function (err, tagsInfo) {
        var pars = {
          pageTitle: '修改文章',
          submitURL: '/backend/art/updatearticle/' + req.params.artid,
          userName: artInfo.author_id.user_name,
          typeName: typeInfo,
          tagName: tagsInfo,
          importScript: scriptlink,
          importStyle: {
            cdn: [
              'select2/4.0.0/css/select2.min.css'
            ]
          },
          artInfo: {
            name: artInfo.title,
            type: artInfo.type_id,
            tags: artInfo.tags_id,
            content: artInfo.content,
            attribute: artInfo.attribute
          }
        }
        res.render('./backend/addArticle', pars);
      })

    });
  })
})
/* 修改文章 */
router.post('/:artid', function (req, res) {
  arcMod.updateArticle(req, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json({
      status: true,
      href: "/backend/art/articlelist"
    });
  });
});

module.exports = router;