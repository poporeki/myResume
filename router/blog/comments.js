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
      'art_content': result.comment_text,
      'like_num': result.like_num,
      'username': req.session.user.username,
      'user': req.session.user._id,
      'submitAddress': result.submit_address,
      'create_time': moment(result.createdAt).format('YYYY-MM-DD hh:mm:ss')
    });
  });

});
router.post('/submitReply', function (req, res) {
  commentMod.insertOneReplyInComment(req, function (err, result) {
    if (err) {
      return;
    }
    res.json({
      'status': true,
      'msg': null,
      'art_content': result.comment_text,
      'like_num': result.like_num,
      'username': req.session.user.username,
      'user': req.session.user._id,
      'submitAddress': result.submit_address,
      'to': result.to,
      'create_time': moment(result.createdAt).format('YYYY-MM-DD hh:mm:ss')

    })
  })
})
module.exports = router;