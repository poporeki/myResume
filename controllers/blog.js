const moment = require('moment')

const articleMod = require("../modules/Article/article"),
  commentMod = require("../modules/Article/articleComments"),
  articleTypeMod = require("../modules/Article/articleType"),
  updateLogMod = require('../modules/UpdateLog');


/**
 * 筛选出文本中img标签的src
 * @param {String} str 需要筛选的文本
 */
let getArticleImgUrl = (str) => {
  if (!str) return null;
  let imgReg = /<img.*?(?:>|\/>)/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  let imgSrc = null;
  let arr = str.match(imgReg);
  if (arr != null) {
    let src = arr[0].match(srcReg);
    if (src == null) {
      imgSrc = null;
    } else {
      imgSrc = src[1];
    }
  } else {
    imgSrc = null;
  }
  return imgSrc;

}

exports.getHomeNavbarToLocals = (req, res, next) => {
  if (res.locals.NAV) next();
  articleTypeMod.findArticleType((err, typeList) => {
    if (err) return next(err);
    res.locals.NAV = typeList;
    next();
  });
}
/**
 * 获取导航列表-文章分类
 */
exports.getHomeNavbar = async (req, res, next) => {
  let getTypeList = () => {
    return new Promise((resolve, reject) => {
      articleTypeMod.findArticleType((err, typeList) => {
        if (err) return reject(err);
        res.locals.NAV = typeList;
        resolve(res.locals.NAV);
      });
    })
  }
  if (!res.locals.NAV) {
    await getTypeList();
  }
  return res.json({
    status: true,
    data: res.locals.NAV
  })
}
exports.showHome = (req, res, next) => {
  /* 获取文章分类 */
  function getArcType() {
    return new Promise((resolve, reject) => {
      articleTypeMod.findArticleType((err, resTypeList) => {
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
        limit: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
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
  let fn = async () => {
    let [
      typeList,
      tagList,
      commList,
      carouList,
      logList
    ] = await Promise.all([
      getArcType(),
      getArcTags(),
      getCommTop(),
      getArcList(),
      updateLogMod.getUpdateLogList({
        limit: 2
      })
    ])
    carouList.map((val, idx) => {
      let src = getArticleImgUrl(val.content);
      if (src !== null || src !== '') {
        val.carouImg = src;
      }
    })
    logList = logList.map(val => {
      return {
        create_time: val.create_time = moment(val.create_time).format('YYYY-MM-DD'),
        log_content: val.log_content,
        log_id: val._id
      }
    })
    commList = commList.map(val => {
      let returnObj = {};
      if (val instanceof Object) {
        for (let obj in val) {
          if (val[obj] instanceof Array) {
            returnObj[obj] = val[obj][0];
          } else {
            returnObj[obj] = val[obj]
          }

        }
      }
      return returnObj;

    })
    let resObj = {
      typeList,
      tagList,
      commList,
      carouList,
      logList
    }
    /*************这里有错误！！！******** */
    res.render('./blog/index', resObj);
  }
  fn().catch(err => {
    return next(err);
  })
}

exports.getArticleList = (req, res, next) => {
  var pars = {
    by: req.query.by || {},
    limit: parseInt(req.query.limit) || 10,
    page: parseInt(req.query.page) || 1,
    sort: req.query.sort || {
      create_time: -1
    }
  };
  pars.by['is_delete'] = false;
  articleMod.showArticleList(pars, (err, resListSortTime) => {
    if (err) return next(err);
    res.json({
      status: true,
      msg: "",
      data: resListSortTime
    });
  });
}