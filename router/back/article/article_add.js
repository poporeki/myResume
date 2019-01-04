const express = require('express'),
  router = express.Router();

const ctlArticle = require('../../../controllers/article');

/* 显示添加文章页面 */
router.get('/', ctlArticle.backend.showAddTheArticle);
/* 提交新文章 */
router.post('/', ctlArticle.backend.submitNewArticle)

module.exports = router;