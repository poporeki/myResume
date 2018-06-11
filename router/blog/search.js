var express = require('express');
var router = express.Router();

var arcMod = require('../../modules/Article/article');
router.get('/:id', function (req, res, next) {

});

router.post('/like', function (req, res, next) {
  var keywords = (req.body.wd).trim();
  if (!keywords) {
    return res.json({
      status: 0,
      msg: '错误的请求'
    })
  };
  arcMod.searchArticlesByKeywords(keywords, function (err, result) {
    if (err) {
      res.json({
        status: -1,
        msg: '服務器錯誤'
      })
      return next(err)
    };
    if (result.length === 0) {
      return res.json({
        status: 0,
        msg: ''
      })
    }
    return res.json({
      status: 1,
      msg: '',
      data: result
    });
  })

})
module.exports = router;