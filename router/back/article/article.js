const express = require('express'),
  router = express.Router();

const mongoose = require('mongoose');
const ctlArticle = require('../../../controllers/article');
const articleMod = require('../../../modules/Article/article');
const articleTypeMod = require('../../../modules/Article/articleType');
const articleTagMod = require('../../../modules/Article/articleTag');
const uploadIMGMod = require('../../../modules/uploadIMG');


const scriptlink = require('./arclist_script');

const ctlUploadFile = require('../../../controllers/upload_files');

router.post('/uploadArtIMG', ctlUploadFile.updateArcImg);
/* 显示文章列表页 */
router.get('/articlelist', ctlArticle.backend.showArticleList);
/* 获取文章列表 */
router.post('/articlelist', ctlArticle.backend.getArticleList);
/* 显示文章回收站 */
router.get('/articleTrash', ctlArticle.backend.moveToTrash);
/* 恢复文章 */
router.get('/restoreArticle/:id', ctlArticle.backend.restoreArticleById);
/* 更新文章 */
router.use('/updatearticle', require('./article_update'));
router.use('/addArticle', require('./article_add'));
router.use('/type', require('./article_type'));
router.use('/tag', require('./article_tag'));
router.use('/remove', require('./article_remove'));
module.exports = router;