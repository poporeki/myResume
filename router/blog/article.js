var express = require('express');
var router = express.Router();

var moment = require('moment');

var articleMod = require('../../modules/Article/article'); /* 文章Module */
var artCommMod = require('../../modules/Article/articleComments'); /* 文章评论Module */

/* 文章页面 */
router.get('/:id', function (req, res, next) {
  /* 获取文章信息 */
  var artid = req.params.id;
  articleMod.showOneArticle(artid, function (err, artDatas) {

    if (err || artDatas.length == 0) {
      return res.render('404');
    }
    articleMod.incReadNum(artid);
    var artInfo = {
      id: artDatas[0]._id,
      /* 文章id */
      title: artDatas[0].title,
      /* 文章标题名 */
      createTime: moment(artDatas[0].create_time).format('YYYY-MM-DD hh:mm'),
      /* 文章创建时间 */
      content: artDatas[0].content,
      /* 文章内容 */
      source: artDatas[0].source,
      /* 文章发布源 */
      author: artDatas[0].author_id ? artDatas[0].author_id.user_name : '佚名',
      /* 文章作者 */
      readNum: artDatas[0].read
    }

    /* 获取文章评论信息 */
    artCommMod.showThisArticleComments(req, function (err, commsDatas) {
      if (err) {
        return;
      }

      var artComms = [];
      for (var i = 0; i < commsDatas.length; i++) {
        var commReps = [];
        var reply = commsDatas[i].reply;

        if (reply.length != 0) {
          for (var idx = 0; idx < reply.length; idx++) {
            var repUser = reply[idx].author_id;
            var obj = {
              user: {
                name: repUser.user_name,
                id: repUser._id,
                avatar: repUser.avatar_path ? repUser.avatar_path.source_name : "/images/my-head.png"
              },
              id: reply[idx]._id,
              repContent: reply[idx].comment_text,
              likeNum: reply[idx].like_num,
              createTime: moment(reply[idx].createdAt).format('YYYY-MM-DD hh:mm:ss'),
              submitAddress: reply[idx].submit_address,
              to: reply[idx].to ? reply[idx].to : '',
              floor: reply[idx].floor
            }
            commReps.push(obj);
          }
        }
        var obj = {
          id: commsDatas[i]._id,
          user: {
            name: commsDatas[i].author_id.user_name,
            avatar: commsDatas[i].author_id.avatar_path ? commsDatas[i].author_id.avatar_path.source_name : "/images/my-head.png"
          },
          submitAddress: commsDatas[i].submit_address,
          createTime: moment(commsDatas[i].createdAt).format('YYYY-MM-DD hh:mm:ss'),
          likeNum: commsDatas[i].like_num,
          text: commsDatas[i].comment_text,
          commReps: commReps,
          floor: commsDatas[i].floor
        }
        artComms.push(obj);
      }

      res.render('./blog/article', {
        art: artInfo,
        artComms: artComms,
        artTotal: commsDatas.total
      });
    })

  })
})

router.use('/', require('./comments'));

module.exports = router;