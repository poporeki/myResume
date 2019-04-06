const articleTag = require('../../db/schema/article/ArticleTag');

module.exports = {
    /**
     * 获取文章标签
     */
    findArticleTags: (pars, cb) => {
        articleTag.find(pars || {}, cb);
    },
    /**添加文章标签 */
    addArticleTag: (pars, cb) => {
        articleTag.create({
            tag_name: pars.t_name
        }, cb);
    }
}