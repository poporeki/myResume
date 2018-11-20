const express = require('express'),
  router = express.Router();


const Article = require('../../../controllers/article');

router.post('/like', Article.getArticleListOfKeywords);
module.exports = router;