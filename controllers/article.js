const moment = require('moment');

const articleMod = require('../modules/Article/article'); /* 文章Module */
const artCommMod = require('../modules/Article/articleComments'); /* 文章评论Module */
const arcTypeMod = require('../modules/Article/articleType');

/**
 * 获取用户是否点赞该文章
 */
let getUserLike = (
  arcid,
  userid
) => {
  return new Promise(async (resolve, reject) => {
    if (!userid) return resolve(false);
    let isLiked = false;
    try {
      isLiked = await articleMod.theArticleLikeOperation(arcid, userid);
    } catch (error) {
      console.log(`liked error`)
    }
    resolve(isLiked)
  })
}
/**
 * 遍历文章数组
 * @param {array} reply 返回的该文章评论回复 
 */
function traversalReply(reply) {
  if (reply.length === 0) return
  let commReplyArr = [];
  for (let idx = 0, replylen = reply.length; idx < replylen; idx++) {
    let repUser = reply[idx].author_id;
    let uAvatarInfo = repUser.avatar_path;
    let repAvatar;
    if (uAvatarInfo) {
      if (uAvatarInfo.is_qiniu) {
        repAvatar = uAvatarInfo.save_path
      } else {
        repAvatar = uAvatarInfo.has_thumbnail ? uAvatarInfo.save_path + 'thumbnail_' + uAvatarInfo.new_name : '';
      }
    }

    let to = '';
    if (reply[idx].to) {
      let t = reply[idx].to;
      let toAvatar = t.avatar_path ? t.avatar_path.save_path + 'thumbnail_' + t.avatar_path.new_name : "/images/my-head.png"
      to = {
        user: {
          id: t.author_id._id,
          name: t.author_id.user_name,
          avatar: toAvatar
        },
        id: t._id,
        arc_content: t.comment_text,
        likeNum: t.like_num,
        create_time: moment(t.create_time).fromNow(),
        submit_address: t.submit_address,
        floor: t.floor
      }
    }

    let obj = {
      user: {
        name: repUser.user_name,
        id: repUser._id,
        avatar: repAvatar
      },
      id: reply[idx]._id,
      arc_content: reply[idx].comment_text,
      likeNum: reply[idx].like_num,
      create_time: moment(reply[idx].create_time).fromNow(),
      submit_address: reply[idx].submit_address,
      to,
      floor: reply[idx].floor
    }
    commReplyArr.push(obj);
  }
  return commReplyArr;
}
/* 评论时间比较 */
function statusArcLike(req) {
  if (req.session.arclikeTime) {
    var now = moment();
    var diff = now.diff(req.session.arclikeTime);
    if (diff < 1000) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}
let getArticleImgUrl = (str) => {
  if (!str) return null;
  let imgReg = /<img.*?(?:>|\/>)/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  let imgSrc = "";
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
/**
 * 通过id获取文章
 * @param {string} arcid 文章id 
 */
let getArcInfo = arcid => {
  return new Promise((resolve, reject) => {
    articleMod.showOneArticle(arcid, function (err, result) {
      if (err || result.length == 0) return reject(err);
      let thisArc = result[0];
      let arcInfo = {
        // 文章id
        id: thisArc._id,
        // 文章标题名
        title: thisArc.title,
        type: {
          id: thisArc.type_id._id,
          name: thisArc.type_id.type_name
        },
        from: thisArc.from,
        tags: thisArc.tags_id,
        // 文章创建时间
        createTime: moment(thisArc.create_time).fromNow(),
        // 文章内容
        content: thisArc.content,
        // 文章发布源
        source: thisArc.source,
        // 文章作者
        author: thisArc.author_id ? thisArc.author_id.user_name : '不知道是谁',
        //阅读数量
        readNum: thisArc.read,
        likes: thisArc.like_this.length
      }
      resolve(arcInfo);
    })
  })
}
/**
 * 获取文章评论
 *
 * @param {Number} limit 获取的数量
 * @param {Number} skip 跳过的数量
 * @param {Stirng} arcid 文章id 
 */
let getArcComm = (limit, skip, arcid) => {
  return new Promise((resolve, reject) => {

    artCommMod.showThisArticleComments(limit, skip, arcid, (err, result) => {
      if (err) return reject(err);
      let artComms = result.map((value, index) => {
        let comms = value;
        let commReps = traversalReply(comms.reply);
        let uAvatarInfo = comms.author_id.avatar_path;
        let uAvatarUrl;
        if (uAvatarInfo) {
          if (uAvatarInfo.is_qiniu) {
            uAvatarUrl = uAvatarInfo.save_path
          } else {
            uAvatarUrl = uAvatarInfo.has_thumbnail ? uAvatarInfo.save_path + 'thumbnail_' + uAvatarInfo.new_name : '';
          }
        }

        return {
          id: comms._id,
          user: {
            name: comms.author_id.user_name,
            avatar: uAvatarUrl
          },
          submit_address: comms.submit_address,
          create_time: moment(comms.create_time).fromNow(),
          likeNum: comms.like_num,
          text: comms.comment_text,
          commReps: commReps,
          floor: comms.floor
        }
      })
      resolve([
        artComms,
        result.total
      ]);
    })
  })
}
/**
 * 获取该文章对应的前后文章
 * @param {String} arcid 文章id
 */
let getTheArticleBnAArticle = (arcid) => {
  return new Promise((resolve, reject) => {
    let getPrevArc = (arcid) => {
      return new Promise((resolve, reject) => {
        articleMod.getPrevArticleById(arcid, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      })
    }
    let getNextArc = (arcid) => {
      return new Promise((resolve, reject) => {
        articleMod.getNextArticleById(arcid, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      })
    }
    let fn = async () => {
      let prevArc = await getPrevArc(arcid);
      let nextArc = await getNextArc(arcid);
      resolve({
        prevArc,
        nextArc
      });
    }
    fn().catch(err => {
      return reject(err);
    })
  })

}
/**
 * 通过文章id得到文章相关信息 
 */
exports.getArticleInfoById = (req, res, next) => {
  // 返回数量 默认10
  let limit = parseInt(req.query.number || 10);
  // 跳过数量
  let skip = parseInt(((req.query.skip || 1) - 1) * 10);
  // 文章id
  let arcid = req.params.id;
  let fn = async () => {
    articleMod.incReadNum(arcid);
    //获得文章信息，[评论列表，总评论数]，判断访问用户是否点过赞
    let [
      arcInfo,
      [arcComments, commsTotal],
      isLiked
    ] = await Promise.all([
      getArcInfo(arcid),
      getArcComm(limit, skip, arcid),
      getUserLike(arcid, req.session.user)
    ]);
    let {
      prevArc,
      nextArc
    } = await getTheArticleBnAArticle(arcid);
    let arcObj = {
      arcInfo,
      arcComms: arcComments,
      userIsLiked: isLiked,
      commsTotal,
      arcPrev: prevArc[0],
      arcNext: nextArc[0]
    }
    return res.json({
      status: 1,
      data: arcObj
    })
  }
  fn().catch(err => {
    return res.json({
      status: 0,
      msg: '获取失败'
    })
  })
}

/**显示文章页面 */
exports.showArticleById = (req, res, next) => {
  // 返回数量 默认10
  let limit = parseInt(req.query.number || 10);
  // 跳过数量
  let skip = parseInt(((req.query.skip || 1) - 1) * 10);
  // 文章id
  let arcid = req.params.id;
  let fn = async () => {
    articleMod.incReadNum(arcid);
    let [
      arcInfo,
      [arcComments, commsTotal],
      isLiked
    ] = await Promise.all([
      getArcInfo(arcid),
      getArcComm(limit, skip, arcid),
      getUserLike(arcid, req.session.user)
    ]);
    let {
      prevArc,
      nextArc
    } = await getTheArticleBnAArticle(arcid);
    res.render('./blog/article', {
      arcInfo,
      arcComms: arcComments,
      userIsLiked: isLiked,
      commsTotal,
      arcPrev: prevArc[0],
      arcNext: nextArc[0]
    });
  }
  fn().catch(err => {
    next(404);
  })
}
/**
 * 按阅读数量排序得到文章列表
 */
exports.getArticleTop = (req, res) => {
  function formatResult(resArclist) {
    if (!resArclist || !resArclist instanceof Array) return;
    let arclist = resArclist.map(arc => {
      return {
        artid: arc._id,
        title: arc.title,
        read: arc.read,
        previewImage: getArticleImgUrl(arc.source),
        timeCreate: moment(arc.create_time).fromNow()
      }
    })
    return arclist;
  }
  articleMod.getArtsByRead(function (err, result) {
    if (err) {
      res.json({
        status: 0,
        msg: '数据获取失败'
      })
    }
    let arclist = formatResult(result);
    return res.json({
      status: 1,
      msg: '',
      data: arclist
    })
  })
}
/**
 * 进行点赞操作
 */
exports.likeDoing = async (req, res, next) => {
  if (!statusArcLike(req)) {
    return res.json({
      status: -1,
      msg: '速度太快了'
    })
  }
  if (!req.session.user) {
    return res.json({
      status: -9,
      msg: '未登录账户'
    })
  }
  // 文章id
  let arcid = req.body.arcid;
  try {
    let [likeTotal, isLiked] = await articleMod.toggleArticleLike(arcid, req.session.user._id);
    req.session.arclikeTime = new Date();
    return res.json({
      status: 1,
      msg: likeTotal,
      data: {
        isLiked
      }
    })
  } catch (err) {
    return res.json({
      status: 0,
      msg: '未知错误'
    })
  }
}
/**
 * 获取文章列表 
 */
exports.getArticleList = (req, res) => {
  let by = req.query.by || {};
  if (typeof by === 'string') {
    typeof by === 'string' && by ? by = JSON.parse(by) : by = {};
  }
  by['is_delete'] = false;
  // 查找数量默认10
  let limit = parseInt(req.query.num) || 10;
  // 当前页数
  let page = parseInt(req.query.page) || 1;
  // 排序 -默认创建时间倒叙
  let sort = req.query.sort || {
    'create_time': -1
  };
  let params = {
    by,
    limit,
    page,
    sort
  };
  /**获取文章列表 */
  let getArticleList = (request) => {
    return new Promise((resolve, reject) => {
      articleMod.showArticleList(request, (err, result) => {
        if (err) return reject(err);
        if (result === undefined) return reject(-1);
        let arclist = result.arcList;
        if (arclist.length == 0) return reject(0);
        let resListArr = arclist.map(arc => {
          return {
            /* 文章id */
            artid: arc.id,
            /* 文章标题 */
            title: arc.title,
            /* 文章html */
            content: arc.content,
            /* 文章创建时间 */
            create_time: arc.time_create
          }
        })
        resolve({
          /*分类 */
          searchedName: result.searchedName,
          /* 文章列表 */
          arclist: resListArr
        });
      })
    })
  }
  let fn = async () => {
    let arclist = await getArticleList(params);
    res.json({
      status: 1,
      msg: '',
      data: arclist
    })
  }
  fn().catch(err => {
    let obj = {
      status: false,
      msg: ''
    }
    if (err === 0) {
      obj['msg'] = '数据不存在'
    } else if (err === -1) {
      obj['msg'] = '数据获取失败'
    } else {
      obj['msg'] = '服务器错误'
    }
    return res.json(obj);
  })
}
/**获取文章列表 */
exports.getArticleListSSR = (req, res, next) => {
  let by = req.query.by || {};
  if (typeof by === 'string') {
    typeof by === 'string' && by ? by = JSON.parse(by) : by = {};
  }
  // 查找数量默认10
  let limit = parseInt(req.query.num) || 10;
  // 当前页数
  let page = parseInt(req.query.page) || 1;
  // 排序 -默认创建时间倒叙
  let sort = req.query.sort || {
    'create_time': -1
  };
  let typeName = '';
  let params = {
    by,
    limit,
    page,
    sort
  };
  /* 获取文章列表 */
  let getArticleList = (request) => {
    return new Promise((resolve, reject) => {
      articleMod.showArticleList(request, (err, result) => {
        if (err) return reject(err);
        if (result === undefined) return reject(-1);
        let arclist = result.arcList;
        if (arclist.length == 0) return reject(0);
        let resListArr = arclist.map(arc => {
          return {
            /* 文章id */
            artid: arc.id,
            /* 文章标题 */
            title: arc.title,
            /* 文章html */
            content: arc.content,
            /* 文章创建时间 */
            create_time: arc.time_create
          }
        })
        typeName = result.typename;
        resolve({
          /*分类 */
          typename: result.typename,
          /* 文章列表 */
          arclist: resListArr
        });
      })
    })
  }
  let fn = async () => {
    let {
      arclist,
      typename
    } = await getArticleList(params);
    res.render('blog/articlelist', {
      artList: arclist,
      typename: typename
    })
  }
  fn().catch(err => {
    if (err === 0) {
      res.render('blog/articlelist', {
        artList: [],
        typename: typeName
      })
    } else if (err === -1) {
      next(err);
    }
  })
}
/**获取文章标签列表 */
exports.getArticleTags = (req, res, next) => {
  /**获取文章标签 */
  let getArcTags = () => {
    return new Promise((resolve, reject) => {
      articleMod.findArticleTagsInfo((err, resTagsList) => {
        if (err) return reject(err);
        resolve(resTagsList);
      });
    })
  }
  let fn = async () => {
    let tagsList = await getArcTags();
    res.json({
      status: true,
      data: tagsList
    })
  }
  fn().catch(err => {
    return res.json({
      status: false,
      msg: '获取失败'
    })
  })
}
/**获取文章分类列表 */
exports.getArticleTypes = (req, res, next) => {
  /**获取文章分类 */
  let getArcType = () => {
    return new Promise((resolve, reject) => {
      arcTypeMod.findArticleType((err, resTypeList) => {
        if (err) return reject(err);
        resolve(resTypeList);
      });
    })
  }
  getArcType().then(typelist => {
    let resJson = typelist.map(item => {
      return {
        typeID: item._id,
        typeName: item.type_name,
        typeIconName: item.iconfont_name
      }
    })

    return res.json(resJson)
  }).catch(err => {
    next(err);
  })
}
/**获取文章列表 -轮播图 */
exports.getArticleListOfCarousel = (req, res, next) => {
  /* 获取文章列表 */
  let getArcList = () => {
    return new Promise((resolve, reject) => {
      let by = {
        attribute: {
          carousel: true,

        }
      };
      let sort = {
        create_time: -1
      }
      articleMod.showArticleList({
        by,
        sort
      }, (err, result) => {
        if (err) return reject(err);
        resolve(result.arcList);
      });
    })
  }
  /**格式化 */
  let entityDataSource = (arclist) => {
    let arr = [];
    for (let j = 0, len = arclist.length; j < len; j++) {
      let obj = {};
      let item = arclist[j];
      let src = getArticleImgUrl(item.source);
      obj['id'] = item.id;
      obj['title'] = item.title;
      obj['imgSrc'] = src;
      obj['timeCreate'] = item.time_create;
      arr.push(obj);
    }
    return arr;
  }
  let fn = async () => {
    let arclist = await getArcList();
    let list = entityDataSource(arclist);
    return res.json({
      status: 1,
      data: list
    })
  }
  fn().catch(err => {
    return res.json({
      status: 0,
      msg: '获取失败'
    })
  })
}
/**获取文章列表-通过输入的文字 */
exports.getArticleListOfKeywords = (req, res, next) => {
  //用户输入的文字
  var keywords = (req.body.wd).trim();
  if (!keywords) {
    return res.json({
      status: 0,
      msg: '错误的请求'
    })
  };
  articleMod.searchArticlesByKeywords(keywords, (err, result) => {
    if (err) return next(-1);
    let obj = {};
    if (result.length === 0) {
      obj.status = 0;
    } else {
      obj.status = 1;
      obj.data = result;
    }
    return res.json(obj);
  })

}

/* 获取该文章前后文章 */
exports.getTheArticleBnAArticleSSR = async (req, res, next) => {
  let arcid = req.params.arcid;
  let prevArc = await articleMod.getPrevArticleById(arcid);
  let nextArc = await articleMod.getNextArticleById(arcid);

}
exports.backend = require('./backend/article');