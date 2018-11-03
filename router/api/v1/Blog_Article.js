var express = require('express');
var router = express.Router();

var moment = require('moment');

var articleMod = require('../../../modules/Article/article'); /* 文章Module */
var artCommMod = require('../../../modules/Article/articleComments'); /* 文章评论Module */

/**
 * 遍历文章数组
 * @param {array} reply 返回的该文章评论回复 
 */
function traversalReply(reply) {
  if (reply.length === 0) return
  let commReplyArr = [];
  for (let idx = 0, replylen = reply.length; idx < replylen; idx++) {
    let repUser = reply[idx].author_id;
    let repAvatar = repUser.avatar_path ? repUser.avatar_path.save_path + 'thumbnail_' + repUser.avatar_path.new_name : "/images/my-head.png"
    let to = '';
    if (reply[idx].to) {
      let t = reply[idx].to;
      let toAvatar = t.avatar_path ? t.avatar_path.save_path + 'thumbnail_' + t.avatar_path.new_name : "/images/my-head.png"
      to = {
        user: {
          id: t.author_id._id,
          name: t.user_name,
          avatar: toAvatar
        },
        id: t._id,
        repContent: t.comment_text,
        likeNum: t.like_num,
        createTime: moment(t.createdAt).fromNow(),
        submitAddress: t.submit_address,
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
      repContent: reply[idx].comment_text,
      likeNum: reply[idx].like_num,
      createTime: moment(reply[idx].createdAt).fromNow(),
      submitAddress: reply[idx].submit_address,
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
        readNum: thisArc.read
      }
      resolve(arcInfo);
    })
  })
}
/* 获取文章评论 */
let getArcComm = (limit, skip, arcid) => {
  return new Promise((resolve, reject) => {

    artCommMod.showThisArticleComments(limit, skip, arcid, (err, result) => {
      if (err) return reject(err);
      let artComms = result.map((value, index) => {
        let comms = value;
        let commReps = traversalReply(comms.reply);
        return {
          id: comms._id,
          user: {
            name: comms.author_id.user_name,
            avatar: comms.author_id.avatar_path ? comms.author_id.avatar_path.save_path + 'thumbnail_' + comms.author_id.avatar_path.new_name : "/images/my-head.png"
          },
          submitAddress: comms.submit_address,
          createTime: moment(comms.createdAt).fromNow(),
          likeNum: comms.like_num,
          text: comms.comment_text,
          commReps: commReps,
          floor: comms.floor
        }
      })
      resolve({
        collection: artComms,
        total: result.total
      });
    })
  })
}
/* 根据id获取文章 */
router.get('/get/:id', (req, res, next) => {
  // 返回数量 默认10
  let limit = parseInt(req.query.number || 10);
  // 跳过数量
  let skip = parseInt(((req.query.skip || 1) - 1) * 10);
  // 文章id
  let arcid = req.params.id;
  let fn = async () => {
    let arcInfo = await getArcInfo(arcid);
    articleMod.incReadNum(arcid);
    let arcComments = await getArcComm(limit, skip, arcid);
    let arcObj = {
      arcInfo,
      arcComments
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
})

/* 按阅读数量排序 获取排行 */
router.get('/getTop', function (req, res, next) {
  articleMod.getArtsByRead(function (err, result) {
    if (err) {
      res.json({
        status: 0,
        msg: '数据获取失败'
      })
      return next(err);
    }
    return res.json({
      status: 1,
      msg: '',
      data: result
    })
  })
})

/* 点赞 */
router.post('/like', async (req, res, next) => {
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
})
module.exports = router;