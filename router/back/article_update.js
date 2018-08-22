var express = require("express");
var router = express.Router();

var arcMod = require("../../modules/Article/article");
var arcTypeMod = require("../../modules/Article/articleType");
var arcTagMod = require("../../modules/Article/articleTag");

var scriptlink = require("./arclist_script");
/* 修改文章 */
router.get("/:artid", function (req, res, next) {
  let renObj = {
    pageTitle: "修改文章",
    submitURL: "/backend/art/updatearticle/" + req.params.artid,
    importScript: scriptlink,
    importStyle: {
      cdn: ["select2/4.0.0/css/select2.min.css"]
    }
  };
  /* 获取文章信息 */
  let getArcInfo = () => {
    return new Promise((resolve, reject) => {
      arcMod.showOneArticle(req.params.artid, function (err, result) {
        if (err) reject(err);
        if (result.length === 0) reject("not article");
        let arc = result[0];
        renObj["userName"] = arc.author_id.user_name;
        renObj["artInfo"] = {
          name: arc.title,
          type: arc.type_id,
          tags: arc.tags_id,
          content: arc.content,
          attribute: arc.attribute
        };
        resolve();
      });
    });
  };
  /* 获取文章分类 */
  let getArcType = () => {
    return new Promise((resolve, reject) => {
      arcTypeMod.findArticleType({}, function (err, result) {
        if (err) reject(err);
        renObj["typeName"] = result;
        resolve();
      });
    });
  };
  /* 获取文章tag标签 */
  let getArcTags = () => {
    return new Promise(
      (resolve,
        reject => {
          arcTagMod.findArticleTags({}, function (err, result) {
            if (err) reject(err);
            renObj["tagName"] = result;
            resolve();
          });
        })
    );
  };
  getArcInfo()
    .then(getArcType)
    .then(getArcTags)
    .then(() => {
      res.render("./backend/addArticle", renObj);
    })
    .catch((err) => next(err));
});
/* 修改文章 */
router.post("/:artid", function (req, res) {
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