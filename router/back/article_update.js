var express = require('express');
var router = express.Router();

var arcMod = require('../../modules/Article/article');
var arcTypeMod = require('../../modules/Article/articleType');
var arcTagMod = require('../../modules/Article/articleTag');
/* 修改文章 */
router.get('/:artid', function (req, res) {
  arcMod.showOneArticle(req.params.artid, function (err, artInfo) {
    if (err) return;
    arcTypeMod.findArticleType({}, function (err, typeInfo) {
      arcTagMod.findArticleTags({}, function (err, tagsInfo) {
        var pars = {
          pageTitle: '修改文章',
          submitURL: '/backend/art/updatearticle/' + req.params.artid,
          userName: artInfo[0].author_id.user_name,
          typeName: typeInfo,
          tagName: tagsInfo,

          artInfo: {
            name: artInfo[0].title,
            types: artInfo[0].type_id,
            tags: artInfo[0].tags_id,
            content: artInfo[0].content,
            attribute: artInfo[0].attribute
          }
        }
        var aaa = pars.typeName;
        var bbb = pars.artInfo.types;
        for (var i = 0; i < aaa.length; i++) {
          for (var j = 0; j < bbb.length; j++) {
            var al = aaa[i];
            var bl = bbb[j];
            if (al == bl) {
              console.log(al + bl);
            }
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