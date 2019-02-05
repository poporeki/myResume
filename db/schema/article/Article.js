var mongoose = require('mongoose');
var moment = require('moment');

var schema = mongoose.Schema;
/**
 * *文章collection
 */
var articleSchema = new schema({
  title: String,
  attribute: {},
  read: Number,
  from: String,
  content: String,
  source: String,
  support: Number,
  is_delete: Boolean,
  like_this: [{
    type: schema.Types.ObjectId,
    ref: 'myweb_user'
  }],
  author_id: {
    type: schema.Types.ObjectId,
    ref: 'myweb_user'
  },
  type_id: {
    type: schema.Types.ObjectId,
    ref: 'arc_type'
  },
  tags_id: [{
    type: schema.Types.ObjectId,
    ref: 'arc_tag'
  }]
}, {
    timestamps: {
      createdAt: 'create_time',
      updatedAt: 'update_time'
    }
  });

/**
 * 
 * @param {object} by 
 * @param {function} cb 
 */
articleSchema.statics.getCount = function (by, cb) {
  return this.find(by).countDocuments().exec(cb);
}

articleSchema.statics.addArticle = function (pars, cb) {
  return this.create(pars, cb);
};
articleSchema.statics.findArticle = function (pars, cb) {
  var pop = [{
    path: 'author_id',
    select: 'user_name'
  }, {
    path: 'type_id'
  }, {
    path: 'tags_id',
    select: 'tag_name'
  }];
  return this
    .find(pars.by)
    .limit(pars.limit)
    .skip(pars.skip)
    .sort(pars.sort)
    .populate(pop)
    .exec(cb);
}
articleSchema.statics.findOneArticle = function (artid, cb) {
  var pop = [{
    path: 'author_id',
    select: 'user_name'
  }, {
    path: 'type_id',
    select: 'type_name'
  }, {
    path: 'tags_id',
    select: 'tag_name'
  }];
  return this
    .find({
      '_id': artid
    })
    .populate(pop)
    .exec(cb);
}
articleSchema.statics.incReadNum = function (artid, cb) {
  return this.updateOne({
    '_id': artid
  }, {
      $inc: {
        read: 1
      }
    }).exec(cb);
}
articleSchema.statics.updateOneArticle = function (artid, pars, cb) {
  return this.updateOne({
    "_id": artid
  }, {
      $set: pars
    }, cb);
}
articleSchema.statics.findOneNextArticleById = function (artid, cb) {
  return this.find({
    '_id': { '$gt': artid }
  }).sort({
    _id: 1
  })
    .limit(1)
    .exec(cb);
}
articleSchema.statics.findOnePrevArticleById = function (artid, cb) {
  return this.find({
    '_id': { '$lt': artid }
  }).sort({
    _id: -1
  })
    .limit(1)
    .exec(cb);
}
var article = mongoose.model('Article', articleSchema);


module.exports = article;