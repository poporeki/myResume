var express = require('express');
var router = express.Router();

var moment = require('moment');

var articleMod = require('../../modules/Article/article'); /* 文章Module */
var artCommMod = require('../../modules/Article/articleComments'); /* 文章评论Module */

/* 文章页面 */
router.get('/:id', (req, res, next) => {
  /* 获取文章信息 */
  let arcid = req.params.id;
  let [artInfo, artComms] = [
    [],
    []
  ];
  let getArcInfo = () => {
    return new Promise((resolve, reject) => {
      articleMod.showOneArticle(arcid, function (err, result) {
        if (err || result.length == 0) {
          return res.render('404');
        }
        articleMod.incReadNum(arcid);
        let thisArt = result[0];
        artInfo = {
          id: thisArt._id,
          /* 文章id */
          title: thisArt.title,
          type: {
            id: thisArt.type_id._id,
            name: thisArt.type_id.type_name
          },
          from: thisArt.from,
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
        resolve();
      })
    })
  }
  /* 获取文章评论 */
  let getArcComm = () => {
    return new Promise((resolve, reject) => {
      artCommMod.showThisArticleComments(req, (err, result) => {
        if (err) reject(err);
        for (let i = 0, commlen = result.length; i < commlen; i++) {
          let commReps = [],
            comms = result[i],
            reply = comms.reply;

          if (reply.length != 0) {
            for (let idx = 0, replylen = reply.length; idx < replylen; idx++) {
              let repUser = reply[idx].author_id;
              let repAvatar = repUser.avatar_path ? repUser.avatar_path.save_path + 'thumbnail_' + repUser.avatar_path.new_name : "/images/my-head.png"
              let obj = {
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
          let obj = {
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
        resolve(result.total);
      })
    })
  }
  getArcInfo().then(getArcComm).then((commTotal) => {
    res.render('./blog/article', {
      art: artInfo,
      artComms: artComms,
      artTotal: commTotal
    });
  }).catch((err) => next(err));

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