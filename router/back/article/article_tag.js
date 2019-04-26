const express = require('express'),
  router = express.Router(),
  moment = require('moment');

const articleTagMod = require('../../../modules/Article/articleTag');

const BackArcCtl = require('../../../controllers/backend/article');

router.get('/add', BackArcCtl.showPageArticleTagAdd);
router.post('/add', BackArcCtl.postArticleTagAdd);
router.post('/update', BackArcCtl.updateArticleTagUpdate);
router.get('/list', BackArcCtl.getArticleTagList);
module.exports = router;