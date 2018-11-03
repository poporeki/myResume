var moment = require("moment");

var articleType = require("../../db/schema/article/ArticleType");
var articles = require("../../db/schema/article/Article");
var articleList = require("../../db/schema/article/ArticleList");

module.exports = {
  /* 添加文章 */
  addArticle: function (req, cb) {
    var pars = {
      title: req.body.arc_title,
      attribute: {
        carousel: req.body.arc_carousel === "on" ? true : false
      },
      from: req.body.arc_reproduction,
      type_id: req.body.arc_type.trim(),
      tags_id: req.body.arc_tags,
      is_delete: false,
      read: 0,
      content: req.body.arc_content,
      source: req.body.arc_conSource,
      support: 12,
      author_id: req.session.user._id
    };
    articles.addArticle(pars, cb);
  },
  /* 阅读数+1 */
  incReadNum: function (artid) {
    articles.incReadNum(artid, function (err) {
      if (err) return;
    });
  },
  /*查找文章列表*/
  showArticleList: function ({
    limit,
    page,
    sort,
    by,
    isRoot
  }, cb) {
    by = by || {};
    !by["is_delete"] ? (by["is_delete"] = false) : "";
    if (isRoot) {
      by["is_delete"] ? delete by["is_delete"] : "";
    }
    // 查找数量默认10
    limit = limit || 10;
    //  排序 默认创建时间正序
    sort = sort || {
      create_time: 1
    };
    let skip = page ? (page - 1) * limit : 0; /* 跳过数量*/
    let typeName = "";

    var pars = {
      by,
      limit,
      skip,
      sort
    };
    /* 获取分类名 */
    let getTypeName = () => {
      return new Promise((resolve, reject) => {
        articleType.findById(by.type_id, (err, result) => {
          if (err) return reject(err);
          if (result && result.type_name) {
            typeName = result.type_name;
          }
          resolve();
        });
      });
    };
    /* 获取文章列表 */
    let getArcList = () => {
      return new Promise((resolve, reject) => {
        articles.findArticle(pars, function (err, result) {
          if (err) return reject(err);
          resolve(result);
        });
      });
    };
    /* 格式化 */
    let formatList = list => {
      return new Promise(resolve => {
        let arcArr = [];
        for (let a = 0; a < list.length; a++) {
          let arc = list[a];
          let obj = {
            id: arc._id,
            title: arc.title,
            author: {
              id: arc.author_id._id,
              name: arc.author_id.user_name
            },
            content: arc.content,
            read: arc.read,
            source: arc.source,
            type: {
              id: arc.type_id ? arc.type_id._id : "null",
              name: arc.type_id ? arc.type_id.type_name : "null"
            },
            likes: arc.like_this ? arc.like_this.length : 0,
            tags: arc.tags_id,
            time_create: moment(arc.create_time).fromNow()
          };
          //TODO 最后记录时间
          /* if (isAdmin) {
            obj['time_lastchange'] = moment(arc.update_time).format('YYYY-MM-DD hh:mm:ss');
          } */
          arcArr.push(obj);
        }
        resolve(arcArr);
      });
    };
    getTypeName()
      .then(getArcList)
      .then(formatList)
      .then(arcList => {
        return cb(null, {
          typename: typeName,
          arcList
        });
      })
      .catch(err => cb(err, null));
  },
  /* 获取所有文章分类 */
  findArticleTypeInfo: function (cb) {
    articles
      .aggregate([{
          $group: {
            _id: "$type_id",
            count: {
              $sum: 1
            }
          }
        },
        {
          $lookup: {
            from: "arc_types",
            localField: "_id",
            foreignField: "_id",
            as: "type_info"
          }
        },
        {
          $project: {
            _id: 1,
            count: 1,
            "type_info.type_name": 1
          }
        }
      ])
      .exec(cb);
  },
  /* 获取所有tag标签信息 */
  findArticleTagsInfo: function (cb) {
    articles
      .aggregate([{
          $unwind: "$tags_id"
        },
        {
          $group: {
            _id: "$tags_id",
            count: {
              $sum: 1
            }
          }
        },
        {
          $lookup: {
            from: "arc_tags",
            localField: "_id",
            foreignField: "_id",
            as: "tags_info"
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{
                  $arrayElemAt: ["$tags_info", 0]
                },
                "$$ROOT"
              ]
            }
          }
        },
        {
          $project: {
            tags_info: 0
          }
        },
        {
          $project: {
            _id: 1,
            count: 1,
            tag_name: 1
          }
        }
      ])
      .exec(cb);
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
      attribute: {
        carousel: req.body.arc_carousel === "on" ? true : false
      },
      from: req.body.arc_reproduction,
      is_delete: false,
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
  /* 删除文章 */
  removeArticle: function (artid, cb) {
    return articles.remove({
        _id: {
          $in: artid
        }
      },
      cb
    );
  },
  /* 删除文章到回收站 */
  moveToTrash: function (artid, cb) {
    return articles.update({
        _id: artid
      }, {
        $set: {
          is_delete: true
        }
      },
      cb
    );
  },
  /* 恢复回收站的文章 */
  recoveryArticle: function (arcid, cb) {
    return articles.update({
        _id: arcid
      }, {
        $set: {
          is_delete: false
        }
      },
      cb
    );
  },
  /* 获得文章总数 */
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
    var reg = new RegExp(keywords, "i");
    return articles
      .find({
        is_delete: false,
        $or: [{
          title: {
            $regex: reg
          }
        }]
      }, {
        title: 1
      })
      .exec(cb);
  },
  /* 获取文章列表-按阅读数排序 */
  getArtsByRead: function (cb) {
    articles
      .find({
        is_delete: false
      })
      .limit(10)
      .sort({
        read: -1
      })
      .exec(function (err, result) {
        if (err) {
          return cb(err, null);
        }

        var imgReg = /<img.*?(?:>|\/>)/gi;
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var artList = [];
        for (var i = 0; i < result.length; i++) {
          var imgSrc = "";
          var str = result[i].content;
          var arr = str.match(imgReg);
          if (arr != null) {
            var src = arr[0].match(srcReg);
            if (src == null) {
              imgSrc = null;
            } else {
              imgSrc = src[1];
            }
          } else {
            imgSrc = null;
          }
          artList.push({
            artid: result[i]._id,
            title: result[i].title,
            read: result[i].read,
            previewImage: imgSrc,
            timeCreate: moment(result[i].create_time).fromNow()
          });
        }
        return cb(null, artList);
      });
  },
  getArticleTitle: function (limit, cb) {
    articles
      .find({
        is_delete: false
      }, {
        _id: 1,
        title: 1
      })
      .limit(limit)
      .sort({
        create_time: -1
      })
      .exec(cb);
  },
  /**
   * 点赞
   * @method incLike
   * @param {'ObjectId'} arcid 文章id
   * @param {'ObjectId'} userid 用户id
   * @param {function} cb 回调函数
   */
  incTheArticleLike: (arcid, userid, cb) => {
    return new Promise((resolve, reject) => {
      articles
        .findOneAndUpdate({
          _id: arcid
        }, {
          $addToSet: {
            like_this: userid
          }
        }, {
          new: true
        })
        .then(result => resolve([result.like_this.length, true]))
        .catch(err => reject(err));
    });
  },
  reduceTheArticleLike: (arcid, userid) => {
    return new Promise((resolve, reject) => {
      articles
        .findOneAndUpdate({
          _id: arcid
        }, {
          $pull: {
            like_this: userid
          }
        }, {
          new: true
        })
        .then(result => resolve([result.like_this.length, false]))
        .catch(err => reject(err));
    });
  },
  /* 切换点赞状态 */
  toggleArticleLike: function (arcid, userid) {
    return new Promise((resolve, reject) => {
      let fn = async () => {
        let isLiked = await this.toggleArticleLike(arcid, userid);
        let result = '';
        if (isLiked) {
          result = await this.reduceTheArticleLike(arcid, userid);
        } else {
          result = await this.incTheArticleLike(arcid, userid);
        }
        resolve(result);
      }
      fn().catch(err => reject(err));
    });
  },
  /* 点赞状态 */
  theArticleLikeOperation: function (arcid, userid) {
    return new Promise(resolve => {
      articles.findOne({
          _id: arcid,
          like_this: userid
        },
        (err, result) => {
          if (err || !result) return resolve(false);
          resolve(true);
        }
      );
    });
  }
};