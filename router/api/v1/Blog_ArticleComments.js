const express = require('express'),
  router = express.Router();

const Comment = require('../../../controllers/article_comments');

/* 文章评论排行 */
router.get('/getTop', Comment.getTop)

router.post('*', Comment.isLogin)
/**
 * 提交评论
 */
router.post("/submitComment", Comment.insertComment);
/**
 * 提交回复
 */
router.post("/submitReply", Comment.insertReplyToComment);
/**
 * 获取评论
 */
router.get('/getcomments', Comment.getCommentsByArcId);
module.exports = router;