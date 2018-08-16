const express = require('express'),
  router = express.Router();

const moment = require('moment');

const commentMod = require('../../modules/Article/articleComments');

router.post('/postComment', (req, res) => {
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
  commentMod.insertOneComment(req, (err, result) => {
    if (err) {
      return;
    }
    req.session.commTime = moment();
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
    });
  });

});
router.post('/submitReply', (req, res) => {
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
            'create_time': moment(comm.createdAt).format('YYYY-MM-DD hh:mm:ss')
          }
        })
        resolve(result);
      })
    })
  }
  insertReply().then(getReplyList).catch(function (err) {
    res.json({
      status: false,
      msg: 'error'
    })
    next(err);
  })
})
router.post('/getComments', function (req, res) {
  commentMod.showThisArticleComments(req, function (err, commsDatas) {
    if (err) {
      return;
    }
    var artComms = [];
    for (let i = 0; i < commsDatas.length; i++) {
      let commReps = [];
      let comm = commsDatas[i],
        reply = comm.reply;

      if (reply.length != 0) {
        for (let idx = 0, repLen = reply.length; idx < repLen; idx++) {
          let rep = reply[idx];
          let author = reply[idx].author_id;
          let repAvatar = author.avatar_path ? author.avatar_path.save_path + 'thumbnail_' + author.avatar_path.new_name : "/images/my-head.png";
          let obj = {
            user: {
              name: author.user_name,
              id: author._id,
              avatar: repAvatar
            },
            id: rep._id,
            repContent: rep.comment_text,
            likeNum: rep.like_num,
            createTime: moment(rep.createdAt).format('YYYY-MM-DD hh:mm:ss'),
            submitAddress: rep.submit_address,
            to: rep.to ? rep.to : '',
            floor: rep.floor
          }
          commReps.push(obj);
        }
      }
      commUser = comm.author_id;
      let commAvatar = commUser.avatar_path ? commUser.avatar_path.save_path + 'thumbnail_' + commUser.avatar_path.new_name : "/images/my-head.png";
      let obj = {
        id: comm._id,
        user: {
          name: commUser.user_name,
          avatar: commAvatar
        },
        submitAddress: comm.submit_address,
        createTime: moment(comm.createdAt).format('YYYY-MM-DD hh:mm:ss'),
        likeNum: comm.like_num,
        text: comm.comment_text,
        commReps: commReps,
        floor: comm.floor
      }
      artComms.push(obj);
    }
    res.json({
      'status': true,
      'msg': null,
      'data': artComms
    })
  })
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