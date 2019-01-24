var articleMod = require("../modules/Article/article"),
  commentMod = require("../modules/Article/articleComments"),
  articleTypeMod = require("../modules/Article/articleType");

exports.getHomeNavbar = (req, res, next) => {
  if (res.locals.NAV) next();
  articleTypeMod.findArticleType("", (err, typeList) => {
    if (err) return next(err);
    res.locals.NAV = typeList;
    next();
  });
}

exports.showHome = (req, res, next) => {
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
}

exports.getArticleList = (req, res, next) => {
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
}