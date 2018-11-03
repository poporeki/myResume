const express = require("express"),
  router = express.Router(),
  moment = require("moment");

var articleMod = require("../../modules/Article/article"),
  commentMod = require("../../modules/Article/articleComments"),
  articleTypeMod = require("../../modules/Article/articleType"),
  arcticleTagMod = require("../../modules/Article/articleTag"),
  weatherMod = require("../../modules/weather"),
  getIP = require("../../modules/getIP");

router.get("/", (req, res, next) => {
  let resObj = {};
  /* 获取文章分类 */
  function getArcType() {
    return new Promise((resolve, reject) => {
      articleTypeMod.findArticleType("", (err, resTypeList) => {
        if (err) return reject(err);
        resObj["typeList"] = resTypeList;
        resolve();
      });
    });
  }
  /* 获取文章tag标签 */
  function getArcTags() {
    return new Promise((resolve, reject) => {
      articleMod.findArticleTagsInfo((err, resTagsList) => {
        if (err) return reject(err);
        resObj["tagList"] = resTagsList;
        resolve();
      });
    });
  }
  /* 获取最新评论 */
  function getCommTop() {
    return new Promise((resolve, reject) => {
      commentMod.findCommentTop((err, resCommList) => {
        if (err) return reject(err);
        resObj["commList"] = resCommList;
        resolve();
      });
    });
  }
  /* 获取文章列表 */
  function getArcList() {
    return new Promise((resolve, reject) => {
      var pars = {
        by: {
          attribute: {
            carousel: true
          }
        },
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
        sort: req.query.sort || {
          create_time: -1
        }
      };
      articleMod.showArticleList(pars, (err, result) => {
        if (err) return reject(err);
        resObj["carouList"] = result.arcList;
        resolve();
      });
    });
  }
  getArcType()
    .then(getArcTags)
    .then(getCommTop)
    .then(getArcList)
    .then(() => {
      res.render("./blog/index", resObj);
    })
    .catch(err => {
      return next(err);
    });
});

router.get("/getArtList", (req, res, next) => {
  var pars = {
    by: req.query.by,
    limit: parseInt(req.query.limit),
    page: parseInt(req.query.page),
    sort: req.query.sort || {
      create_time: -1
    }
  };
  articleMod.showArticleList(pars, (err, resListSortTime) => {
    if (err) {
      next(err);
    }
    res.json({
      status: true,
      msg: "",
      data: resListSortTime
    });
  });
});

router.get("/info", (req, res) => {
  commentMod.findCommentTop((err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

router.use("/ip", require("./ip"));
router.use("/user", require("./user")); /* 用户 */
router.use("/article", require("./article")); /* 获取文章 */
router.use("/articlelist", require("./articlelist")); /* 获取文章列表 */
router.use("/getType", require("../api/v1/Blog_ArticleTypes")); /* 获取分类 */
router.use("/getTags", require("../api/v1/Blog_ArticleTags")); /* 获取标签 */
router.use(
  "/getCommtop",
  require("../api/v1/Blog_ArticleComments")
); /* 获取最新评论 */
router.use(
  "/getCarousel",
  require("../api/v1/Blog_Carousel")
); /* 获取轮播列表 */
router.use("/getWeather", require("../api/v1/Weather")); /* 获取天气 */
router.use("/", require("./comments"));
module.exports = router;