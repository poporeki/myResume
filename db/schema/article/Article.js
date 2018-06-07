var mongoose = require('mongoose');
var moment = require('moment');

var schema = mongoose.Schema;

var articleSchema = new schema({
  title: String,
  attribute: [],
  read: Number,
  content: String,
  source: String,
  support: Number,
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'myweb_user'
  },
  type_id: [{
    type: schema.Types.ObjectId,
    ref: 'arc_type'
  }],
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


articleSchema.statics.getCount = function (by, cb) {
  return this.find(by).count().exec(cb);
}

articleSchema.statics.addArticle = function (pars, cb) {
  return this.create(pars, cb);
};
articleSchema.statics.findArticle = function (pars, cb) {
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
  return this.update({
    '_id': artid
  }, {
    $inc: {
      read: 1
    }
  }).exec(cb);
}
articleSchema.statics.updateOneArticle = function (artid, pars, cb) {
  return this.update({
    "_id": artid
  }, {
    $set: pars
  }, cb);
}
var article = mongoose.model('Article', articleSchema);


module.exports = article;