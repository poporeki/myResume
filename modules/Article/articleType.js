const articleType = require('../../db/schema/article/ArticleType');

module.exports = {
    /**
     * 获取文章分类
     * @param pars{Object} 参数
     * @param cb{Function} 回调
     */
    findArticleType: (pars, cb) => {
        articleType.find(pars || {}, cb);
    },
    /**
     * 增加文章分类
     * @param typeName{String} 分类名
     * @param iconName{String} 图标类名
     * @param cb{Function} 回调
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
    }
}