var express = require('express');
var router = express.Router();

var moment = require('moment');

var articleMod = require('../../modules/Article/article'); /* 文章Module */
var artCommMod = require('../../modules/Article/articleComments'); /* 文章评论Module */

/**
 * 遍历文章数组
 * @param {返回的该文章评论回复} reply 
 */
function traversalReply(reply) {
  if (reply.length != 0) return
  let commReplyArr = [];
  for (let idx = 0, replylen = reply.length; idx < replylen; idx++) {
    let repUser = reply[idx].author_id;
    let repAvatar = repUser.avatar_path ? repUser.avatar_path.save_path + 'thumbnail_' + repUser.avatar_path.new_name : "/images/my-head.png"
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
      to: reply[idx].to ? reply[idx].to : '',
      floor: reply[idx].floor
    }
    commReplyArr.push(obj);
  }
  return commReplyArr;
}
/**
 * 通过id获取文章
 * @param {对象容器} arcObj 
 */
let getArcInfo = ({
  args,
  arcObj
}) => {
  return new Promise((resolve, reject) => {
    articleMod.showOneArticle(args.arcid, function (err, result) {
      if (err || result.length == 0) return reject(err)
      articleMod.incReadNum(args.arcid);
      let thisArc = result[0];
      let artInfo = {
        id: thisArc._id,
        /* 文章id */
        title: thisArc.title,
        type: {
          id: thisArc.type_id._id,
          name: thisArc.type_id.type_name
        },
        from: thisArc.from,
        tags: thisArc.tags_id,
        /* 文章标题名 */
        createTime: moment(thisArc.create_time).fromNow(),
        /* 文章创建时间 */
        content: thisArc.content,
        /* 文章内容 */
        source: thisArc.source,
        /* 文章发布源 */
        author: thisArc.author_id ? thisArc.author_id.user_name : '不知道是谁',
        /* 文章作者 */
        readNum: thisArc.read
      }
      arcObj['arcInfo'] = artInfo;
      resolve({
        args,
        arcObj
      });
    })
  })
}
/* 获取文章评论 */
let getArcComm = ({
  args,
  arcObj
}) => {
  return new Promise((resolve, reject) => {

    artCommMod.showThisArticleComments(args.limit, args.skip, args.arcid, (err, result) => {
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
      arcObj['arcComms'] = artComms;
      arcObj['commTotal'] = result.total
      resolve(arcObj);
    })
  })
}
/* 文章页面 */
router.get('/:id', (req, res, next) => {
  var limit = parseInt(req.query.number || 10); /* 返回数量 默认10*/
  var skip = parseInt(((req.query.skip || 1) - 1) * 10); /* 跳过数量 */
  /* 获取文章信息 */
  let arcid = req.params.id;
  let arcObj = {}
  getArcInfo({
      arcObj,
      args: {
        limit,
        skip,
        arcid
      }
    })
    .then(getArcComm)
    .catch(err => {
      return res.render('404');
    })
    .then((arcObj) => {
      res.render('./blog/article', {
        art: arcObj.arcInfo,
        artComms: arcObj.arcComms,
        artTotal: arcObj.commTotal
      });
    }).catch((err) => next(err));

})

router.get('/a/:id', (req, res, next) => {
  var limit = parseInt(req.query.number || 10); /* 返回数量 默认10*/
  var skip = parseInt(((req.query.skip || 1) - 1) * 10); /* 跳过数量 */
  /* 获取文章信息 */
  let arcid = req.params.id;
  let arcObj = {}
  getArcInfo({
      arcObj,
      args: {
        limit,
        skip,
        arcid
      }
    })
    .then(getArcComm)
    .catch(err => {
      return res.json({
        status: true,
        code: 404
      })
    })
    .then(arcObj => {
      res.json({
        status: true,
        code: 1,
        data: arcObj
      });
    }).catch(err => {
      res.json({
        status: false,
        code: 0,
        msg: '错误'
      })
    });
})
router.post('/getTop', function (req, res, next) {
  articleMod.getArtsByRead(function (err, result) {
    if (err) {
      res.json({
        status: false,
        msg: '数据获取失败'
      })
      return next(err);
    }
    return res.json({
      status: true,
      msg: '',
      data: result
    })
  })
})
router.use('/', require('./comments'));

module.exports = router;