const articleTag = require('../../db/schema/article/ArticleTag');

module.exports = {
    findArticleTags: (pars, cb) => {
        articleTag.find(pars || {}, cb);
    },
    addArticleTag: (pars, cb) => {
        articleTag.create({ tag_name: pars.t_name }, cb);
    }
}