var articleType = require('../../db/schema/article/ArticleType');
var articles = require('../../db/schema/article/Article');
var articleList = require('../../db/schema/article/ArticleList');


module.exports = {
  /* 添加文章 */
  addArticle: function (req, cb) {
    var pars = {
      title: req.body.arc_title,
      attribute: req.body.arc_attr,
      type_id: req.body.arc_type,
      tags_id: req.body.arc_tags,
      read: 0,
      content: req.body.arc_content,
      source: req.body.arc_conSource,
      support: 12,
      author_id: req.session.user._id
    };
    articles.addArticle(pars, cb);
  },
  incReadNum: function (artid) {
    articles.incReadNum(artid, function (err) {
      if (err) return;
    });
  },
  /*查找文章列表*/
  showArticleList: function (req, cb) {
    var by = req.query.by || req.body.by || {};
    var limit = Number(req.query.num || req.body.num) || 10; /* 查找数量默认10 */
    var page = req.query.page || req.body.page; /* 当前页数 */
    var skip = page ? ((page - 1) * limit) : 0; /* 跳过数量*/
    var sort = req.query.sort || {
      'create_time': -1
    }; /* 排序 默认创建时间倒叙 */
    var pars = {
      "by": by,
      "limit": limit,
      "skip": skip,
      "sort": sort
    }
    articles.findArticle(pars, cb);
  },
  /* 根据id查找文章 */
  showOneArticle: function (artid, cb) {

    return articles.findOneArticle(artid || {}, cb);
  },
  /* 文章阅读数量数+1 */
  addReadNum: function (artid, cb) {
    return commentSchema.incReadNum(artid, cb);
  },
  /* 修改文章 */
  updateArticle: function (req, cb) {
    var artid = req.params.artid; /* id */
    var pars = {
      title: req.body.arc_title,
      /* 标题 */
      attribute: req.body.arc_attr,
      /*  */
      type_id: req.body.arc_type,
      tags_id: req.body.arc_tags,
      /* 分类 */
      content: req.body.arc_content,
      /* Html内容 */
      source: req.body.arc_conSource /* 纯文本 */
    };
    return articles.updateOneArticle(artid, pars, cb);
  },
  removeArticle: function (artid, cb) {
    return articles.remove({
      _id: {
        $in: artid
      }
    }, cb);
  },
  getCount: function (req, cb) {
    var by = req.body.by || req.query.by || {};
    return articles.getCount(by, cb);
  },
  /**
   * *通过文字查询匹配的文章
   * @param{String} 查询的文字
   * @param{Object} 回调
   */
  searchArticlesByKeywords: function (keyword, cb) {
    var keywords = keyword;
    var reg = new RegExp(keywords, 'i');
    return articles.find({
        $or: [{
          title: {
            $regex: reg
          }
        }]
      }, {
        title: 1
      })
      .exec(cb);
  }
}