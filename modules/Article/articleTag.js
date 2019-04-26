const articleTag = require('../../db/schema/article/ArticleTag');

module.exports = {
  /**
   * 获取文章标签
   */
  findArticleTags(cb) {
    articleTag.find({}, cb);
  },
  /**添加文章标签 */
  addArticleTag(pars, cb) {
    articleTag.create({
      tag_name: pars.t_name
    }, cb);
  },
  /**
   * 更新文章标签-根据标签id
   * @method updateArticleTagById
   * @param {String} tagid 标签id
   * @param {Object} param1 修改参数
   */
  updateArticleTagById(tagid, {
    tag_name
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await articleTag.updateOne({
          _id: tagid
        }, {
          $set: {
            tag_name
          }
        })
        result.ok === 1 ? resolve(result) : reject(0);
      } catch (err) {
        reject(err);
      }
    })
  }
}