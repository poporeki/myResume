const express = require('express'),
  router = express.Router();

const moment = require('moment');

const commentMod = require('../../modules/Article/articleComments');
const getIPInfoMod = require('../../modules/getClientIP');


/* 获取客户端ip */
let getIP = (req) => {
  return new Promise((resolve, reject) => {
    getIPInfoMod(req, ipInfo => {
      let ip = ipInfo.ip;
      let address = ipInfo.city && ipInfo.region ? ipInfo.region + ' ' + ipInfo.city : '地球';
      resolve({
        ip,
        address
      });
    });
  });
}
router.post('/postComment', (req, res) => {
  if (!req.session.user) {
    return res.json({
      status: -9,
      msg: '登陆失效'
    })
  }
  if (!statusComment(req)) {
    return res.json({
      'status': -1,
      'msg': '评论间隔时间太短，请休息一下哦'
    });
  }
  let commText = (req.body.comm_content).trim();
  if (commText === '') {
    return res.json({
      'status': -1,
      'msg': '内容不能为空'
    });
  }
  let authorId = req.session.user._id;
  let arcid = req.body.arc_id;
  let userAgent = req.useragent.source;
  getIP(req).then(({
    ip,
    address
  }) => {
    commentMod.insertOneComment({
      authorId,
      commText,
      arcid,
      userAgent,
      ip,
      address
    }, (err, result) => {
      if (err) {
        return res.json({
          status: false,
          msg: '获取错误'
        });
      }
      req.session.commTime = moment();
      return res.json({
        status: true,
        msg: null,
        data: {
          art_content: result.comment_text,
          like_num: result.like_num,
          username: req.session.user.username,
          user: req.session.user._id,
          submitAddress: result.submit_address,
          floor: result.floor,
          create_time: moment(result.createdAt).fromNow()
        }
      });
    });
  })



});
router.post('/submitReply', (req, res) => {
  if (!req.session.user) {
    return res.json({
      status: -9,
      msg: '登陆失效'
    })
  }
  if (!statusComment(req)) {
    return res.json({
      'status': -1,
      'msg': '评论间隔时间太短，请休息一下哦'
    });
  }
  var commText = req.body.comm_content;
  if (commText.trim() === '') {
    return res.json({
      'status': -1,
      'msg': '内容不能为空'
    });
  }
  /* 插入回复 */
  function insertReply() {
    return new Promise((resolve, reject) => {
      commentMod.insertOneReplyInComment(req, (err, result) => {
        if (err) reject(err);
        req.session.commTime = moment();
        if (result.to === undefined) {
          return res.json({
            'status': true,
            'msg': null,
            'data': {
              'art_content': result.comment_text,
              'like_num': result.like_num,
              'username': req.session.user.username,
              'user': req.session.user._id,
              'submitAddress': result.submit_address,
              'floor': result.floor,
              'create_time': moment(result.createdAt).format('YYYY-MM-DD hh:mm:ss')
            }
          })
        }
        resolve(result);
      });
    })
  }
  /* 获取回复列表 */
  function getReplyList(comm) {
    return new Promise((resolve, reject) => {
      commentMod.findCommentReplyById(comm.to, (err, result) => {
        if (err) {
          reject(err);
        }
        res.json({
          'status': true,
          'msg': null,
          'data': {
            'art_content': comm.comment_text,
            'like_num': comm.like_num,
            'username': req.session.user.username,
            'user': req.session.user._id,
            'submitAddress': comm.submit_address,
            'to': result[0].author_id ? result[0].author_id.user_name : 'not',
            'floor': comm.floor,
            'create_time': moment(comm.createdAt).fromNow()
          }
        })
        resolve(result);
      })
    })
  }
  insertReply().then(getReplyList).catch(err => {
    res.json({
      status: false,
      msg: 'error'
    })
    next(err);
  })
})
router.post('/getComments', (req, res) => {
  var limit = parseInt(req.body.number || 10); /* 返回数量 默认10*/
  var skip = parseInt(((req.body.skip || 1) - 1) * 10); /* 跳过数量 */
  if (!req.body.artid) return res.json({
    status: false,
    msg: '文章id错误,数据获取失败'
  })
  var artid = req.body.artid; /* 文章id */
  /* 获取文章评论 */
  let getThisArcComments = () => {
    return new Promise((resolve, reject) => {
      commentMod.showThisArticleComments(limit, skip, artid, (err, commsDatas) => {
        if (err) return reject(err);
        if (commsDatas === undefined || commsDatas.length === 0) return reject(0);
        let commlist = commsDatas.map(comm => {
          let commUser = comm.author_id;
          let commReps = traverseTheReply(comm.reply);
          let commAvatar = commUser.avatar_path ? commUser.avatar_path.save_path + 'thumbnail_' + commUser.avatar_path.new_name : "";
          return {
            /* 评论id */
            id: comm._id,
            /* 评论人{用户名，头像} */
            user: {
              name: commUser.user_name,
              avatar: commAvatar
            },
            /* 评论地址 */
            submitAddress: comm.submit_address,
            /* 评论时间 */
            createTime: moment(comm.createdAt).fromNow(),
            /* 点赞数 */
            likeNum: comm.like_num,
            /* 评论内容 */
            text: comm.comment_text,
            /* 该评论的回复 */
            commReps: commReps,
            /* 评论楼层 */
            floor: comm.floor
          }
        })
        resolve(commlist);
      })
    })
  }
  /* 遍历评论回复 返回null或Array */
  let traverseTheReply = (replys) => {
    if (typeof replys === undefined || replys.length === 0) return null;
    return replys.map(reply => {
      let author = reply.author_id; /* 回复人 */
      /* 回复人头像 src */
      let repAvatar = author.avatar_path ? author.avatar_path.save_path + 'thumbnail_' + author.avatar_path.new_name : "";
      return {
        user: {
          /* 用户名 */
          name: author.user_name,
          /* 用户id */
          id: author._id,
          /* 用户头像 */
          avatar: repAvatar
        },
        /* 该回复 id */
        id: reply._id,
        /* 回复内容 */
        repContent: reply.comment_text,
        /* 点赞数 */
        likeNum: reply.like_num,
        /* 回复时间 */
        createTime: moment(reply.createdAt).fromNow(),
        /* 回复地点 */
        submitAddress: reply.submit_address,
        /* 被回复 */
        to: reply.to ? reply.to : '',
        /* 回复层数 */
        floor: reply.floor
      }
    })
  }
  getThisArcComments().then(commlist => res.json({
    status: true,
    data: commlist
  })).catch(err => errProcess())
  let errProcess = () => {
    if (err === 0) {
      return res.json({
        status: false,
        error: 0,
        msg: '没有相关数据'
      })
    } else {
      return res.json({
        status: false,
        error: -1,
        msg: '请求数据错误'
      })
    }
  }
})
module.exports = router;

/* 评论时间比较 */
function statusComment(req) {
  if (req.session.commTime) {
    var now = moment();
    var diff = now.diff(req.session.commTime);
    if (diff < 60000) {
      return false;
    } else {
      return true;
    };
  } else {
    return true;
  }
}