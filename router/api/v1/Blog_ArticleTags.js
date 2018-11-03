/**
 * 分类
 */
const express = require('express'),
  router = express.Router();

const articleMod = require("../../../modules/Article/article");
/* 获取文章分类 */
router.get('/', (req, res, next) => {
  let getArcTags = () => {
    return new Promise((resolve, reject) => {
      articleMod.findArticleTagsInfo((err, resTagsList) => {
        if (err) return reject(err);
        resolve(resTagsList);
      });
    })
  }
  getArcTags().then(taglist => {
    return res.json({
      status: true,
      data: taglist
    })
  }).catch(() => {
    return res.json({
      status: false,
      msg: '获取失败'
    })
  })
})
module.exports = router;