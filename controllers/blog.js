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
  /* 获取文章分类 */
  function getArcType() {
    return new Promise((resolve, reject) => {
      articleTypeMod.findArticleType("", (err, resTypeList) => {
        if (err) return reject(err);
        resolve(resTypeList);
      });
    });
  }
  /* 获取文章tag标签 */
  function getArcTags() {
    return new Promise((resolve, reject) => {
      articleMod.findArticleTagsInfo((err, resTagsList) => {
        if (err) return reject(err);
        resolve(resTagsList);
      });
    });
  }
  /* 获取最新评论 */
  function getCommTop() {
    return new Promise((resolve, reject) => {
      commentMod.findCommentTop((err, resCommList) => {
        if (err) return reject(err);
        resolve(resCommList);
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
        resolve(result.arcList);
      });
    });
  }
  let fn=async()=>{
    let result=await Promise.all([
      getArcType(),
      getArcTags(),
      getCommTop(),
      getArcList()
    ])
    let resObj={
      typeList:result[0],
      tagList:result[1],
      commList:result[2],
      carouList:result[3]
    }
    res.render('./blog/index',resObj);
  }
  fn().catch(err=>{
    return next(err);
  })
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
    if (err) return  next(err);
    res.json({
      status: true,
      msg: "",
      data: resListSortTime
    });
  });
}