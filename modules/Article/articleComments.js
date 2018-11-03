/*
 * @Author: yansk 
 * @Date: 2018-10-30 19:03:35 
 * @Last Modified by: yansk
 * @Last Modified time: 2018-11-02 13:07:38
 */

const commentSchema = require("../../db/schema/article/Comments");
const commentReplySchema = require("../../db/schema/article/CommentsReplys.js");

const getIPInfoMod = require("../../modules/getClientIP");

module.exports = {
  /**
   * TODO点赞
   */
  addLikeNum: (id, cb) => {
    commentSchema.updateLikeNum(id, cb);
  },
  /**
   * 根据文章id查询该文章评论总数
   * @method getCommentCountById
   * @param {string} artid  文章id
   * @param {function} cb   回调函数
   */
  getCommentCountById: function (artid, cb) {
    commentSchema
      .find({
        article_id: artid
      })
      .count()
      .exec((err, commCount) => {
        if (err) return cb(err, null);
        return cb(null, commCount);
      });
  },
  /**
   * 插入一条评论
   * @method insertOneComment
   * @param {object} param0  {用户id,评论文本,文章id,userAgent,ip地址,评论地址}
   * @param {function} cb 回调函数
   */
  insertOneComment: function ({
      authorId,
      commText,
      arcid,
      userAgent,
      ip,
      address
    },
    cb
  ) {
    /* 获取当前文章评论总数量 */
    let getComm = () => {
      return new Promise((resolve, reject) => {
        commentSchema
          .find({
            article_id: arcid
          })
          .count()
          .exec((err, commCount) => {
            if (err) return reject(err);
            let floor = commCount + 1;
            /* 插入一条评论 */
            resolve(floor);
          });
      });
    };
    /* 写入数据库 */
    let insertComment = obj => {
      return new Promise((resolve, reject) => {
        commentSchema.insertOneComment(obj, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    };
    let fn = async () => {
      let obj = {
        author_id: authorId,
        comment_text: commText,
        article_id: arcid,
        like_num: 0,
        replay: null,
        useragent: userAgent,
        submit_ip: ip,
        submit_address: address
      };
      let commTotal = await getComm();
      obj["floor"] = commTotal;
      let insertResult = await insertComment(obj);
      return cb(null, insertResult);
    };
    fn().catch(err => cb(err, null));
  },
  /**
   * 根据文章id查询文章评论
   * @param {number} limit 查询数量
   * @param {number} skip  跳过数量
   * @param {string} artid 文章id
   * @param {function} cb 回调函数
   */
  showThisArticleComments: function (limit, skip, artid, cb) {
    /* 获取评论条数 */
    let getCommCount = () => {
      return new Promise((resolve, reject) => {
        commentSchema
          .find({
            article_id: artid
          })
          .count()
          .exec((err, commCount) => {
            if (err) return reject(err);
            resolve(commCount);
          });
      });
    };
    /* 获取文章评论 */
    let getThisArcComments = () => {
      return new Promise((resolve, reject) => {
        commentSchema.findThisArticleComments(
          artid,
          limit,
          skip,
          (err, resComm) => {
            if (err) return reject(err);
            if (resComm === undefined || resComm === null) return reject(0);
            resolve(resComm);
          }
        );
      });
    };
    let fn = async () => {
      let [commCount, commlist] = await Promise.all([
        getCommCount(),
        getThisArcComments()
      ]);
      commlist["total"] = commCount;
      return cb(null, commlist);
    };
    fn().catch(err => cb(err, null));
  },
  /**
   * 插入一条评论回复
   * @method insertOneReplyInComment
   * @param {object} {文章id，用户id，评论id，评论内容，被回复id，userAgent，ip地址，回复地址}
   * @param {function} 回调函数
   */
  insertOneReplyInComment: ({
      articleId,
      authorId,
      commentId,
      commentContent,
      to,
      userAgent,
      ip,
      address
    },
    cb
  ) => {
    let obj = {
      comment_text: commentContent, // 评论内容
      author_id: authorId, // 评论人
      article_id: articleId, // 文章id
      comment_id: commentId,
      to: to,
      useragent: userAgent,
      submit_ip: ip,
      submit_address: address
    };
    /* 获取回复条数 */
    let getReplyTotal = () => {
      return new Promise((resolve, reject) => {
        commentReplySchema
          .find({
            comment_id: obj.comment_id
          })
          .count()
          .exec(function (err, replyCount) {
            if (err) return reject(err);
            obj["floor"] = replyCount + 1;
            resolve(replyCount);
          });
      });
    };
    /* 插入数据 */
    let insertReply = () => {
      return new Promise((resolve, reject) => {
        commentReplySchema.insertOneReply(obj, function (err, result) {
          if (err) return reject(err);
          resolve(result);
        });
      });
    };
    /* 更新数据 */
    let updateComm = (commid, savedRepid) => {
      return new Promise((resolve, reject) => {
        commentSchema
          .update({
            _id: commid
          }, {
            $push: {
              reply: savedRepid
            }
          })
          .exec((err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
      });
    };

    let fn = async () => {
      let replyCount = await getReplyTotal();
      let resReply = await insertReply(replyCount);
      await updateComm(commentId, resReply._id);
      return cb(null, resReply);
    };
    fn().catch(err => cb(err, null));
  },
  /**
   * 通过回复id 获取评论的回复
   * @method findCommentReplyById
   * @param {string} repid 回复id
   * @param {function} cb 回调函数
   */
  findCommentReplyById: (repid, cb) => {
    return commentReplySchema
      .find({
        _id: repid
      })
      .populate([{
        path: "author_id"
      }])
      .exec(cb);
  },
  findComment: (req, cb) => {
    let pars = {
      commid: req.body.comment_id,
      reply: {
        skip: req.body.skip || (req.body.page - 1) * 10,
        limit: req.body.limit || 10
      }
    };
    return commentSchema
      .find({
        _id: pars.commid
      })
      .populate([{
          path: "author_id"
        },
        {
          path: "reply",
          options: {
            sort: {
              create_time: -1
            },
            limit: pars.reply.limit,
            skip: pars.reply.skip
          },
          populate: [{
              path: "author_id"
            },
            {
              path: "to",
              populate: {
                path: "author_id"
              }
            }
          ]
        }
      ])
      .exec(cb);
  },

  /**
   * 按插入时间查询评论前5条
   * @method findCommentTop
   * @param {function} cb 回调函数
   */
  findCommentTop: cb => {
    commentSchema
      .aggregate([{
          $sort: {
            createdAt: -1
          }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: "myweb_users",
            localField: "author_id",
            foreignField: "_id",
            as: "author"
          }
        },
        {
          $lookup: {
            from: "articles",
            localField: "article_id",
            foreignField: "_id",
            as: "article"
          }
        },
        {
          $lookup: {
            from: "upload_files",
            localField: "author.avatar_path",
            foreignField: "_id",
            as: "avatar"
          }
        },
        {
          $project: {
            _id: 0,
            comment_text: 1,
            "author.user_name": 1,
            "avatar.new_name": 1,
            "avatar.save_path": 1,
            "article._id": 1,
            "article.title": 1
          }
        }
      ])
      .exec(cb);
  }
};