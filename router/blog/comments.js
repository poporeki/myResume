var express = require('express');
var router = express.Router();

var moment = require('moment');
var commentMod = require('../../modules/Article/articleComments');

router.post('/postComment', function (req, res) {
  commentMod.insertOneComment(req, function (err, result) {
    if (err) {
      return;
    }
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
router.post('/submitReply', function (req, res) {
  commentMod.insertOneReplyInComment(req, function (err, result) {
    if (err) {
      return;
    }
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
    commentMod.findCommentReplyById(result.to, function (err, resRep) {
      if (err) return;
      res.json({
        'status': true,
        'msg': null,
        'data': {
          'art_content': result.comment_text,
          'like_num': result.like_num,
          'username': req.session.user.username,
          'user': req.session.user._id,
          'submitAddress': result.submit_address,
          'to': resRep[0].author_id ? resRep[0].author_id.user_name : 'not',
          'floor': result.floor,
          'create_time': moment(result.createdAt).format('YYYY-MM-DD hh:mm:ss')
        }
      })
    })

  })
})
router.post('/getComments', function (req, res) {
  commentMod.showThisArticleComments(req, function (err, commsDatas) {
    if (err) {
      return;
    }
    var artComms = [];
    for (var i = 0; i < commsDatas.length; i++) {
      var commReps = [];
      var reply = commsDatas[i].reply;

      if (reply.length != 0) {
        for (var idx = 0; idx < reply.length; idx++) {
          var a = reply[idx].author_id;
          var obj = {
            user: {
              name: reply[idx].author_id.user_name,
              id: reply[idx].author_id._id
            },
            id: reply[idx]._id,
            repContent: reply[idx].comment_text,
            likeNum: reply[idx].like_num,
            createTime: moment(reply[idx].createdAt).format('YYYY-MM-DD hh:mm:ss'),
            submitAddress: reply[idx].submit_address,
            to: reply[idx].to ? reply[idx].to : '',
            floor: reply[idx].floor
          }
          commReps.push(obj);
        }
      }
      var obj = {
        id: commsDatas[i]._id,
        user: {
          name: commsDatas[i].author_id.user_name
        },
        submitAddress: commsDatas[i].submit_address,
        createTime: moment(commsDatas[i].createdAt).format('YYYY-MM-DD hh:mm:ss'),
        likeNum: commsDatas[i].like_num,
        text: commsDatas[i].comment_text,
        commReps: commReps,
        floor: commsDatas[i].floor
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