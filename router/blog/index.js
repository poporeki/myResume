var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
var articleTypeMod = require('../../modules/Article/articleType.js');
router.use('/', function (req, res, next) {
  if (!req.session.user || !req.session.user.username) {
    res.redirect('/login');
    return;
  };
  next();
})

router.get('/', function (req, res) {
  articleMod.showArticleList(req, function (err, resListSortTime) {
    if (err) {
      return
    }
    // var str = result[2].content;
    // //匹配图片（g表示匹配所有结果i表示区分大小写）
    // var imgReg = /<img.*?(?:>|\/>)/gi;
    // //匹配src属性
    // var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    // var arr = str.match(imgReg);
    // var src = arr[0].match(srcReg);

    // req.query['sort']={
    //     'like_num':-1
    // }
    // articleMod.showArticleList(req,function(err,resListSortLike){
    //     if(err){
    //         return
    //     }


    // })
    articleTypeMod.findArticleType('', function (err, typelist) {
      if (err) return;
      console.log(typelist);
      res.render('./blog/index', {
        artList: resListSortTime,
        typeList: typelist
      });
    })

  })
});
router.use('/article', require('./article'));
router.use('/articlelist', require('./articlelist'));
router.use('/', require('./comments'));
module.exports = router;