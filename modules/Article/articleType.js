const articleType = require('../../db/schema/article/ArticleType');

module.exports = {
    findArticleType: (pars, cb) => {
        articleType.find(pars || {}, cb);
    },
    addArticleType: (typeName, iconName, cb) => {
        articleType.create({
            type_name: typeName,
            iconfont_name: iconName
        }, cb);
    },
    removeArticleType: (typeid, cb) => {
        articleType.remove({
            _id: typeid
        }).exec(cb);
    }
}