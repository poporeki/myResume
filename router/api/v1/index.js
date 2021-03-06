/*
 * @name: 接口 v1版本
 * @Author: yansk 
 * @Date: 2018-11-01 21:35:38 
 * @Last Modified by: yansk
 * @Last Modified time: 2018-11-07 21:28:40
 */

const express = require('express');
const router = express.Router();

const BlogCtl = require('../../../controllers/blog');

/**获取导航列表 */
router.get('/getHomeNavbar', BlogCtl.getHomeNavbar);
/**文章相关 */
router.use('/article', require('./Blog_Article'));
/**文章列表相关 */
router.use('/articlelist', require('./Blog_ArticleList'));
router.use('/getArctags', require('./Blog_ArticleTags'));
router.use('/getArctypes', require('./Blog_ArticleTypes'));
router.use('/getCarousel', require('./Blog_Carousel'));
router.use('/article/comment', require('./Blog_ArticleComments'));
router.use('/article/search', require('./Blog_Search'));
router.use('/weather', require('./Weather'));
router.use('/user', require('./User'));
router.use('/bing', require('./bing'));
router.use('/tuchong', require('./tuchong'))
router.use('/tools', require('./tools'));
router.use('/qqmusic', require('./QQMusic'));
router.use('/qiniu', require('./qiniu'));
module.exports = router;