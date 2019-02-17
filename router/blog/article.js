const express = require('express'),
 router = express.Router();

const ArticleCtl=require('../../controllers/article');

/* 文章页面 */
router.get('/:id',ArticleCtl.showArticleById);
module.exports = router;