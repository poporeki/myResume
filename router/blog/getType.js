const express = require('express'),
  router = express.Router();

const articleTypeMod = require('../../modules/Article/articleType');
/* 获取文章分类 */
router.get('/', (req, res, next) => {
  let getArcType = () => {
    return new Promise((resolve, reject) => {
      articleTypeMod.findArticleType('', (err, resTypeList) => {
        if (err) return reject(err);
        resolve(resTypeList);
      });
    })
  }
  getArcType().then(typelist => {
    return res.json(typelist)
  })
})
module.exports = router;