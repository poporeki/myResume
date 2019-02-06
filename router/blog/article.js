var express = require('express');
var router = express.Router();

var moment = require('moment');

var articleMod = require('../../modules/Article/article'); /* 文章Module */
var artCommMod = require('../../modules/Article/articleComments'); /* 文章评论Module */

const articleCtl=require('../../controllers/article');
/* 获取用户是否点赞该文章 */
let getUserLike = (
  arcid,
  userid
) => {
  if (!userid) return false;
  return new Promise(async (resolve, reject) => {
    let isLiked = false;
    try {
      isLiked = await articleMod.theArticleLikeOperation(arcid, userid);
    } catch (error) {

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
        createTime: moment(t.create_time).fromNow(),
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
      createTime: moment(reply[idx].create_time).fromNow(),
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
        likes: thisArc.like_this ? thisArc.like_this.length : 0,
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
      resolve([
        artComms,
        result.total
      ]);
    })
  })
}
/* 获得前后文章 */
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
      resolve({ prevArc, nextArc });
    }
    fn().catch(err => {
      return reject(err);
    })
  })

}
/* 文章页面 */
router.get('/:id',articleCtl.showArticleById);


router.use('/', require('./comments'));

module.exports = router;