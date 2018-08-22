const articleType = require('../../db/schema/article/ArticleType');

module.exports = {
    findArticleType: (pars, cb) => {
        articleType.find(pars || {}, cb);
    },
    addArticleType: (pars, cb) => {
        articleType.create({
            type_name: pars.t_name
        }, cb);
    },
    removeArticleType: (typeid, cb) => {
        articleType.remove({
            _id: typeid
        }).exec(cb);
    }
}