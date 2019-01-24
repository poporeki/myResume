const express = require("express"),
  router = express.Router(),
  moment = require("moment");

var articleMod = require("../../modules/Article/article"),
  commentMod = require("../../modules/Article/articleComments"),
  articleTypeMod = require("../../modules/Article/articleType");

const blogCtl = require('../../controllers/blog');
router.use('*', blogCtl.getHomeNavbar);

router.get("/", blogCtl.showHome);

router.get("/getArtList", blogCtl.getArticleList);

router.use("/ip", require("./ip"));
router.use("/user", require("./user")); /* 用户 */
router.use("/article", require("./article")); /* 获取文章 */
router.use("/articlelist", require("./articlelist")); /* 获取文章列表 */
router.use("/getType", require("../api/v1/Blog_ArticleTypes")); /* 获取分类 */
router.use("/getTags", require("../api/v1/Blog_ArticleTags")); /* 获取标签 */
router.use("/getCommtop", require("../api/v1/Blog_ArticleComments")); /* 获取最新评论 */
router.use("/getCarousel", require("../api/v1/Blog_Carousel")); /* 获取轮播列表 */
router.use("/getWeather", require("../api/v1/Weather")); /* 获取天气 */
router.use("/", require("./comments"));
module.exports = router;