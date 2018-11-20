const express = require('express'),
  router = express.Router();

const article = require('../../../controllers/article');

/* 根据id获取文章 */
router.get('/get/:id', article.getArticleInfoById)
/* 按阅读数量排序 获取排行 */
router.get('/getTop', article.getArticleTop)
/* 点赞 */
router.post('/like', article.likeDoing)

module.exports = router;