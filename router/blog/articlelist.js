const express = require('express'),
  router = express.Router();

const ArticleCtl = require('../../controllers/article');

router.get('/', ArticleCtl.getArticleListSSR);
module.exports = router;