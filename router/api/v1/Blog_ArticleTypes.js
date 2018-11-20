const express = require('express'),
  router = express.Router();

const Article = require('../../../controllers/article');

/* 获取文章分类 */
router.get('/', Article.getArticleTypes);

module.exports = router;