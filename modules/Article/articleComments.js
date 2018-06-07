var commentSchema = require('../../db/schema/article/Comments');
var commentReplySchema = require('../../db/schema/article/CommentsReplys.js');
var getIPInfoMod = require('../../modules/getClientIP');

module.exports = {
    /* 点赞 */
    addLikeNum: function (id, cb) {
        commentSchema.updateLikeNum(id, cb);
    },
    /* 插入一条评论 */
    insertOneComment: function (req, cb) {
        getIPInfoMod(req, function (ipInfo) {
            var pars = {
                author_id: req.session.user._id,
                comment_text: req.body.comm_content,
                article_id: req.body.art_id,
                like_num: 0,
                submit_address: ipInfo.city && ipInfo.region ? ipInfo.city + ipInfo.region : '地球',
                replay: null
            }
            /* 返回当前文章回复Length */
            commentSchema.find({article_id:pars.article_id}).count().exec(function(err,commCount){
                if(err) return;
                /* 增加楼层 */
                pars['floor']=commCount+1;
                /* 插入一条评论 */
                return commentSchema.insertOneComment(pars, cb);
            })
            
        });

    },
    /* 查询该文章所有评论 */
    showThisArticleComments: function (req,cb) {
        var limit=req.query.number||10;/* 返回数量 默认10*/
        var skip=req.query.page-1*10;/* 跳过数量 */
        var artid=req.params.id;/* 文章id */
        return commentSchema.findThisArticleComments(artid,limit,skip, cb);
    },
    insertOneReplyInComment: function (req, cb) {
        /* 获取用户当前ip */
        getIPInfoMod(req, function (ipInfo) {
            var pars = {
                comment_text: req.body.comm_content,/* 评论内容 */
                author_id: req.session.user._id,/* 评论人 */
                article_id: req.body.art_id,/* 文章id */
                comment_id: req.body.commid,
                to:req.body.reply_id,
                submit_address: ipInfo.city && ipInfo.region ? ipInfo.city + ipInfo.region : '未知领域'
            }
            commentReplySchema.find({comment_id:pars.comment_id}).count().exec(function(err,replyCount){
                if(err) return;
                console.log(replyCount);
                pars['floor']=replyCount+1;
                /* 插入一条回复 */
                commentReplySchema.insertOneReply(pars, function (err, replyRes) {
                    if (err) return cb(err,null);
                    return commentSchema.update({
                        "_id": req.body.commid
                    }, {
                        $push: {
                            'reply': replyRes._id
                        }
                    }).exec(function(err,result){
                        if(err) return cb(err,null);
                        return cb(null,replyRes);
                    });
                })
            });
            
        })
    }
}