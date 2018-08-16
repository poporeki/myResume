var commentSchema = require('../../db/schema/article/Comments');
var commentReplySchema = require('../../db/schema/article/CommentsReplys.js');
var getIPInfoMod = require('../../modules/getClientIP');

module.exports = {
  /* 点赞 */
  addLikeNum: function (id, cb) {
    commentSchema.updateLikeNum(id, cb);
  },
  getCommentCountById: function (artid, cb) {
    commentSchema.find({
      article_id: artid
    }).count().exec(function (err, commCount) {
      if (err) return cb(err, null);
      return cb(null, commCount);
    })
  },
  /* 插入一条评论 */
  insertOneComment: function (req, cb) {
    var pars = {
      author_id: req.session.user._id,
      comment_text: (req.body.comm_content).trim(),
      article_id: req.body.art_id,
      like_num: 0,
      replay: null
    }
    /* 获取客户端ip */
    function getIP() {
      return new Promise(function (resolve, reject) {
        getIPInfoMod(req, function (ipInfo) {
          pars['submit_address'] = ipInfo.city && ipInfo.region ? ipInfo.city + ipInfo.region : '地球';
          resolve();
        });
      });
    }
    /* 获取当前文章评论总数量 */
    function getComm() {
      return new Promise(function (resolve, reject) {
        commentSchema.find({
          article_id: pars.article_id
        }).count().exec(function (err, commCount) {
          if (err) {
            reject(err);
          };
          /* 增加楼层 */
          pars['floor'] = commCount + 1;
          /* 插入一条评论 */
          resolve();
        })
      })
    }
    getIP()
      .then(getComm)
      .then(function () {
        return commentSchema.insertOneComment(pars, cb);
      }).catch(function (err) {
        cb(err, null);
      })


  },
  /* 查询该文章所有评论 */
  showThisArticleComments: function (req, cb) {
    var limit = parseInt(req.query.number || req.body.number || 10); /* 返回数量 默认10*/
    var skip = parseInt(req.skip || req.body.skip || req.query.page - 1 * 10); /* 跳过数量 */
    var artid = req.params.id || req.body.artid; /* 文章id */
    commentSchema.find({
      "article_id": artid
    }).count().exec(function (err, commCount) {
      if (err) return cb(err, null);
      return commentSchema.findThisArticleComments(artid, limit, skip, function (err, resComm) {
        if (err) return cb(err, null);
        resComm['total'] = commCount;
        cb(null, resComm);
      });
    });

  },
  insertOneReplyInComment: function (req, cb) {
    var pars = {
      comment_text: (req.body.comm_content).trim(),
      /* 评论内容 */
      author_id: req.session.user._id,
      /* 评论人 */
      article_id: req.body.art_id,
      /* 文章id */
      comment_id: req.body.commid,
      to: req.body.reply_id
    }
    /* 获取用户当前ip */
    function getIP() {
      return new Promise(function (resolve, reject) {
        getIPInfoMod(req, function (ipInfo) {
          pars['submit_address'] = ipInfo.city && ipInfo.region ? ipInfo.city + ipInfo.region : '未知领域';
          resolve();
        });
      });
    }

    function getReplyTotal() {
      return new Promise((resolve, reject) => {
        commentReplySchema.find({
          comment_id: pars.comment_id
        }).count().exec(function (err, replyCount) {
          if (err) {
            reject(err);
          };
          pars['floor'] = replyCount + 1;
          resolve();
        })
      });
    }

    function insertReply() {
      return new Promise((resolve, reject) => {
        commentReplySchema.insertOneReply(pars, function (err, result) {
          if (err) {
            reject(err);
          }
          resolve(result);
        })
      })
    }

    function updateComm(replyRes) {
      return new Promise((resolve, reject) => {
        commentSchema.update({
          "_id": req.body.commid
        }, {
          $push: {
            'reply': replyRes._id
          }
        }).exec(function (err, result) {
          if (err) {
            reject(err);
          };
          resolve(replyRes);
        });
      })
    }
    getIP()
      .then(getReplyTotal)
      .then(insertReply)
      .then(updateComm)
      .then(function (replyRes) {
        return cb(null, replyRes);
      }).catch(function (err) {
        return cb(err, null);
      })

  },
  findCommentReplyById: function (repid, cb) {
    return commentReplySchema.find({
      _id: repid
    }).populate([{
      path: 'author_id'
    }]).exec(cb);
  },
  findComment: function (req, cb) {
    var pars = {
      commid: req.body.comment_id,
      reply: {
        skip: req.body.skip || (req.body.page - 1) * 10,
        limit: req.body.limit || 10
      }
    }
    return commentSchema.find({
      _id: pars.commid
    }).populate([{
      path: 'author_id'
    }, {
      path: 'reply',
      options: {
        sort: {
          'create_time': -1
        },
        limit: pars.reply.limit,
        skip: pars.reply.skip
      },
      populate: [{
        path: 'author_id'
      }, {
        path: 'to',
        populate: {
          path: 'author_id'
        }
      }]
    }]).exec(cb);
  },
  findCommentTop: function (cb) {
    commentSchema.aggregate([{
      $sort: {
        createdAt: -1
      }
    }, {
      $limit: 5
    }, {
      $lookup: {
        from: 'myweb_users',
        localField: 'author_id',
        foreignField: '_id',
        as: 'author'
      }
    }, {
      $lookup: {
        from: 'articles',
        localField: 'article_id',
        foreignField: '_id',
        as: 'article'
      }
    }, {
      $lookup: {
        from: 'upload_files',
        localField: 'author.avatar_path',
        foreignField: '_id',
        as: 'avatar'
      }
    }, {
      $project: {
        '_id': 0,
        'comment_text': 1,
        'author.user_name': 1,
        'avatar.new_name': 1,
        'avatar.save_path': 1,
        'article._id': 1,
        'article.title': 1
      }
    }]).exec(cb);
  }
}