const express = require('express'),
  router = express.Router();


const Article = require('../../../controllers/article');

/**查询 */
router.post('/like', Article.getArticleListOfKeywords);
module.exports = router;