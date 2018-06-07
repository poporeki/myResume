var articleTag=require('../../db/schema/article/ArticleTag');

module.exports={
    findArticleTags:function(pars,cb){
        articleTag.find(pars||{},cb);
    },
    addArticleTag:function(pars,cb){
        articleTag.create(pars||{},cb);
    }
}