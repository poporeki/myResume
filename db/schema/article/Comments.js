var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  comment_text: String,
  like_num: Number,
  floor: {
    type: Number,
    default: 0
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'myweb_user'
  },
  article_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  },
  reply: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'commentReply'
  }],
  useragent: String,
  submit_ip: String,
  submit_address: String
}, {
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});
/**
 * 阅读数量增加
 * @param {String}  commid 文章id
 * @param {Function} cb 回调函数
 */
commentSchema.statics.updateLikeNum = function (commid, cb) {
  this.findById(commid, function (err, result) {
    if (err) {
      return;
    }
    var likeNum = result[0].like_num;
    return this.updateOne({
      '_id': id
    }, {
      $set: {
        'like_num': likeNum++
      }
    }, cb)
  })

}
/**
 * 获取一段时间内的评论数量
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 */
commentSchema.statics.getTotalOfDays = function (startTime, endTime, cb) {
  return this.find({
    create_time: {
      "$gte": new Date(startTime + ' 00:00:00').toISOString(),
      "$lt": new Date(endTime + ' 24:00:00').toISOString()
    }
  }).countDocuments().exec(cb);
}
/**
 * 获取文章评论列表
 * @param {String} artid 文章id
 * @param {Number} limit 查询数量
 * @param {Number} skip 跳过数量
 * @param {Function} cb 回调
 */
commentSchema.statics.findThisArticleComments = function (artid, limit, skip, cb) {
  return this.find({
    "article_id": artid
  }).limit(limit).skip(skip).sort({
    'create_time': -1
  }).populate([{
    path: "author_id",
    populate: {
      path: 'avatar_path'
    }
  }, {
    path: "reply",
    options: {
      sort: {
        'create_time': -1
      },
      limit: 10,
      skip: 0
    },
    populate: [{
      path: 'author_id',
      populate: {
        path: 'avatar_path'
      }
    }, {
      path: 'to',
      populate: {
        path: 'author_id',
        populate: {
          path: 'avatar_path'
        }
      }
    }]
  }]).exec(cb);
}
commentSchema.statics.insertOneReplyInComment = function (commid, cb) {
  return this.create({})
}
/**
 * 插入一条评论
 * @param {Object} pars 参数
 * @param {Function} cb 回调
 */
commentSchema.statics.insertOneComment = function (pars, cb) {
  return this.create(pars, cb);
}
var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;