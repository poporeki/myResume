const express = require('express'),
  router = express.Router();

const BackArcCtl = require('../../../controllers/backend/article')

//添加标签页面
router.get('/add', BackArcCtl.showPageArticleTypeAdd)
//提交添加标签
router.post('/add', BackArcCtl.postArticleTypeAdd);
//修改标签
router.post('/update', BackArcCtl.postArticleTypeUpdate);
//标签列表页面
router.get('/list', BackArcCtl.showPageArticleTypeList);

module.exports = router;