const express = require('express'),
  router = express.Router();

var Article = require('../../../controllers/article');


/* post请求 文章列表 */
router.get('/getlist', Article.getArticleList);
module.exports = router;