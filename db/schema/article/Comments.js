var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    comment_text: String,
    like_num: Number,
    floor: {
        type: Number,
        default: 0
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myweb_user'
    },
    article_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    reply: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentReply'
    }],
    submit_address: String
}, {
    timestamps: {
        createAt: 'create_time',
        updateAt: 'update_time'
    }
});

commentSchema.statics.updateLikeNum = function (commid, cb) {
    this.findById(commid, function (err, result) {
        if (err) {
            return;
        }
        var likeNum = result[0].like_num;
        return this.update({
            '_id': id
        }, {
            $set: {
                'like_num': likeNum++
            }
        }, cb)
    })

}
commentSchema.statics.findThisArticleComments = function (artid, limit, skip, cb) {
    return this.find({
        "article_id": artid
    }).limit(limit).skip(skip).sort({
        'createdAt': -1
    }).populate([{
        path: "author_id",
        select: 'user_name'
    }, {
        path: "reply",
        options: {
            sort: {
                'createdAt': -1
            },
            limit: 5,
            skip: 0
        },
        populate: [{
            path: 'author_id'
        }, {
            path: 'to',
            populate: {
                path: 'author_id'
            }
        }]
    }]).exec(cb);
}
commentSchema.statics.insertOneReplyInComment = function (commid, cb) {
    return this.create({})
}
commentSchema.statics.insertOneComment = function (pars, cb) {
    return this.create(pars, cb);
}
var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;