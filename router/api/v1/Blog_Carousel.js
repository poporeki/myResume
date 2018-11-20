/**
 * 轮播
 */
const express = require('express'),
  router = express.Router();

const Article = require('../../../controllers/article');

router.get('/', Article.getArticleListOfCarousel);

module.exports = router;