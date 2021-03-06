const moment = require("moment");

const articleType = require("../../db/schema/article/ArticleType"),
  articleTag = require("../../db/schema/article/ArticleTag"),
  articles = require("../../db/schema/article/Article"),
  articleList = require("../../db/schema/article/ArticleList");

module.exports = {
  /* 添加文章 */
  addArticle: function (pars, cb) {

    articles.addArticle(pars, cb);
  },
  /**
   * 阅读数量+1
   * @param {String} artid 文章id 
   */
  incReadNum: function (artid) {
    articles.incReadNum(artid, function (err) {
      if (err) return;
    });
  },
  /**
   *查找文章列表
   * @param {Object} param0 单页数量，页数，排序，by，是否Root
   * @param {function} cb 回调
   */
  showArticleList: function ({
    limit,
    page,
    sort,
    by,
    keywords,
    isRoot
  }, cb) {
    if (by['is_delete']) {
      if (isRoot && !by.is_delete) {
        by["is_delete"] ? delete by["is_delete"] : "";
      }
    } else {
      by['is_delete'] = false;
    }
    // 查找数量默认10
    limit = limit || 10;
    //  排序 默认创建时间正序
    sort = sort || {
      create_time: 1
    };
    // 跳过数量
    let skip = page === 1 ? 0 : (page - 1) * limit;

    let pars = {
      by,
      limit,
      skip,
      sort
    };
    let getSearchedName = async (by) => {

      let result = '';
      by.tags_id !== undefined && (result = await getTagName(by.tags_id));
      by.type_id !== undefined && (result = await getTypeName(by.type_id));
      return result;
    }
    // 获取分类名
    let getTypeName = (typeid) => {
      return new Promise((resolve, reject) => {
        articleType.findById(typeid, (err, result) => {
          if (err) return reject(err);
          if (result && result.type_name) {
            let typeName = result.type_name || '';
            resolve(typeName);
          }
          resolve('');
        });
      });
    };
    let getTagName = (tagid) => {
      return new Promise((resolve, reject) => {
        articleTag.findById(tagid, (err, result) => {
          if (err) return reject(err);
          if (result && result.tag_name) {
            let tagName = result.tag_name || '';
            resolve(tagName);
          }
          resolve('');
        });
      });
    };
    // 获取文章列表
    let getArcList = () => {
      return new Promise((resolve, reject) => {
        articles.findArticle(pars, function (err, result) {
          if (err) return reject(err);
          resolve(result);
        });
      });
    };
    // 格式化
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
            time_create: moment(arc.create_time).fromNow(),
            time_update: moment(arc.update_time).fromNow()
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
    let fn = async () => {
      let [sName, arcList] = await Promise.all([
        getSearchedName(by),
        getArcList()
      ]);
      arcList = await formatList(arcList);
      return cb(null, {
        searchedName: sName,
        arcList
      })
    }
    fn().catch(err => {
      return cb(err, null);
    })
  },
  /**
   * 获取所有文章分类
   * @param {function} cb 回调
   */
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
  /**
   * 获取所有tag标签信息
   * @param {function} cb 回调函数
   */
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
  /**
   * 查找文章信息
   * @param {ObjectId} artid 文章id 
   * @param {funciton} cb 回调函数
   */
  showOneArticle: function (artid, cb) {
    return articles.findOneArticle(artid || {}, cb);
  },
  /**
   * 文章阅读数量增加
   * @param {ObjectId} artid 文章id
   * @param {function} cb 回调函数
   */
  addReadNum: function (artid, cb) {
    return commentSchema.incReadNum(artid, cb);
  },
  /* 修改文章 */
  updateArticle: function (arcid, updateObj, cb) {
    return articles.updateOneArticle(arcid, updateObj, cb);
  },
  /* 删除文章 */
  removeArticle: function (artid, cb) {
    return articles.remove({
      _id: {
        $in: artid
      }
    }, cb);
  },
  /**
   * 删除文章到回收站
   * @param {ObjectId} artid 文章id
   * @param {Function} cb 回调函数
   */
  moveToTrash: (artid, cb) => {
    return articles.update({
      _id: artid
    }, {
      $set: {
        is_delete: true
      }
    }, cb);
  },
  /**
   * 恢复回收站的文章
   * @param {ObjectId} arcid 文章id
   * @param {Function} cb 回调函数
   */
  recoveryArticle: (arcid, cb) => {
    return articles.update({
      _id: arcid
    }, {
      $set: {
        is_delete: false
      }
    }, cb);
  },
  /* 获得文章总数 */
  getCount: function (by, cb) {
    return articles.getCount(by, cb);
  },
  /**
   * *通过文字查询匹配的文章
   * @param{String} 查询的文字
   * @param{Object} 回调
   */
  searchArticlesByKeywords: function (keyword, cb) {
    let keywords = keyword;
    let reg = new RegExp(keywords, "i");
    return articles
      .find({
        is_delete: false,
        $or: [{
          title: {
            $regex: reg
          }
        }]
      }, {
        source: 0,
        like_this: 0,
        attribute: 0,
        is_delete: 0
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
        if (err) return cb(err, null);
        return cb(null, result);
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
  /**
   * 切换点赞状态 
   * @param {String} arcid 文章id
   * @param {String} userid 用户id
   * */
  toggleArticleLike: function (arcid, userid) {
    return new Promise((resolve, reject) => {
      let fn = async () => {
        //查询用户是否对该文章进行点赞
        let isLiked = await this.theArticleLikeOperation(arcid, userid);
        let result = "";
        //根据点赞的状态进行数据库操作
        result = isLiked ? await this.reduceTheArticleLike(arcid, userid) : await this.incTheArticleLike(arcid, userid);
        resolve(result);
      };
      fn().catch(err => reject(err));
    });
  },
  /**
   * 点赞状态 
   * @param {String} arcid 文章id
   * @param {String} userid 用户id
   **/
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
  },
  /**
   * 得到下一篇文章
   * @param {String} arcid 文章id
   * @param {Function} cb 回调
   */
  getNextArticleById: (arcid, cb) => {
    articles.findOneNextArticleById(arcid, cb);
  },
  /**
   * 得到上一篇文章
   * @param {String} arcid 文章id
   * @param {Function} cb 回调
   */
  getPrevArticleById: (arcid, cb) => {
    articles.findOnePrevArticleById(arcid, cb);
  }
};