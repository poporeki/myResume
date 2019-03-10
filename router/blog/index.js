const express = require("express"),
  router = express.Router();

const blogCtl = require('../../controllers/blog');

router.use('*', blogCtl.getHomeNavbarToLocals);
router.get("/", blogCtl.showHome);
router.get("/getArtList", blogCtl.getArticleList);
router.get('/about', (req, res, next) => {
  res.render('./blog/about');
})

router.use("/ip", require("./ip"));
/* 用户 */
router.use("/user", require("./user"));
/* 获取文章 */
router.use("/article", require("./article"));
/* 获取文章列表 */
router.use("/articlelist", require("./articlelist"));
/* 获取分类 */
router.use("/getType", require("../api/v1/Blog_ArticleTypes"));
/* 获取标签 */
router.use("/getTags", require("../api/v1/Blog_ArticleTags"));
/* 获取最新评论 */
router.use("/getCommtop", require("../api/v1/Blog_ArticleComments"));
/* 获取天气 */
router.use("/getWeather", require("../api/v1/Weather"));
/* 获取轮播列表 */
router.use("/getCarousel", require("../api/v1/Blog_Carousel"));
/* 更新日志 */
router.use('/log', require('./updatelog'));
module.exports = router;