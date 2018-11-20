const express = require('express'),
  router = express.Router();

const Comment = require('../../../controllers/article_comments');

/* 文章评论排行 */
router.get('/getTop', Comment.getTop)

router.post('*', Comment.isLogin)
router.post("/submitComment", Comment.insertComment);
router.post("/submitReply", Comment.insertReplyToComment);

module.exports = router;