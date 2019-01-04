const uploadIMGMod = require('../modules/uploadIMG');
/**
 * 上传文章图片
 */
exports.updateArcImg = (req, res, next) => {
  uploadIMGMod.upLoadIMG(req, '/images/upload/article/', (err, result) => {
    if (err) return next(err);
    return res.json({
      "errno": 0,
      "data": [result]
    })
  })
}