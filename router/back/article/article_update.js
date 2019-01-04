const express = require("express"),
  router = express.Router();

const ctlArticle = require('../../../controllers/article');


/* 显示修改文章页面 */
router.get("/:artid", ctlArticle.backend.showUpdateArticleById);
/* 提交修改 */
router.post("/:artid", ctlArticle.backend.submitUpdate);

module.exports = router;