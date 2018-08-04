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
    var thisArt = artDatas[0];
    var artInfo = {
      id: thisArt._id,
      /* 文章id */
      title: thisArt.title,
      type: {
        id: thisArt.type_id._id,
        name: thisArt.type_id.type_name
      },
      tags: thisArt.tags_id,
      /* 文章标题名 */
      createTime: moment(thisArt.create_time).format('YYYY-MM-DD hh:mm'),
      /* 文章创建时间 */
      content: thisArt.content,
      /* 文章内容 */
      source: thisArt.source,
      /* 文章发布源 */
      author: thisArt.author_id ? thisArt.author_id.user_name : '佚名',
      /* 文章作者 */
      readNum: thisArt.read
    }

    /* 获取文章评论信息 */
    artCommMod.showThisArticleComments(req, function (err, commsDatas) {
      if (err) {
        return;
      }

      var artComms = [];
      for (var i = 0; i < commsDatas.length; i++) {
        var commReps = [],
          comms = commsDatas[i],
          reply = comms.reply;

        if (reply.length != 0) {
          for (var idx = 0; idx < reply.length; idx++) {
            var repUser = reply[idx].author_id;
            var repAvatar = repUser.avatar_path ? repUser.avatar_path.save_path + 'thumbnail_' + repUser.avatar_path.new_name : "/images/my-head.png"
            var obj = {
              user: {
                name: repUser.user_name,
                id: repUser._id,
                avatar: repAvatar
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
          id: comms._id,
          user: {
            name: comms.author_id.user_name,
            avatar: comms.author_id.avatar_path ? comms.author_id.avatar_path.save_path + 'thumbnail_' + comms.author_id.avatar_path.new_name : "/images/my-head.png"
          },
          submitAddress: comms.submit_address,
          createTime: moment(comms.createdAt).format('YYYY-MM-DD hh:mm:ss'),
          likeNum: comms.like_num,
          text: comms.comment_text,
          commReps: commReps,
          floor: comms.floor
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

router.post('/getTop', function (req, res, next) {
  articleMod.getArtsByRead(function (err, result) {
    if (err) {
      res.json({
        status: false,
        msg: '数据获取失败'
      })
      return next(err);
    }
    return res.json({
      status: true,
      msg: '',
      data: result
    })
  })
})
router.use('/', require('./comments'));

module.exports = router;