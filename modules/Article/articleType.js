const articleType = require('../../db/schema/article/ArticleType');

module.exports = {
  /**
   * 获取文章分类
   * @param pars{Object} 参数
   * @param cb{Function} 回调
   */
  findArticleType: (cb) => {
    articleType.find({}, cb);
  },
  /**
   * 增加文章分类
   * @param {String} typeName 分类名
   * @param {String} iconName 图标类名
   * @param {Function} cb 回调
   */
  addArticleType: (typeName, iconName, cb) => {
    articleType.create({
      type_name: typeName,
      iconfont_name: iconName
    }, cb);
  },
  /**
   * 移除文章分类
   * @param typeid{String} 分类id
   * @param cb{Function} 回调
   */
  removeArticleType: (typeid, cb) => {
    articleType.remove({
      _id: typeid
    }).exec(cb);
  },
  /**
   * 更新文章分类-根据标签id
   * @method updateArticleTypeById
   * @param {String} typeid 分类id
   * @param {Object} param1 修改参数
   */
  updateArticleTypeById(typeid, {
    type_name,
    icon_name
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await articleType.updateOne({
          _id: typeid
        }, {
          $set: {
            type_name,
            iconfont_name: icon_name
          }
        })
        result.ok === 1 ? resolve(result) : reject(0);
      } catch (err) {
        reject(err);
      }
    })
  }
}