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
    useragent: String,
    submit_ip: String,
    submit_address: String
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time'
    }
});

commentSchema.statics.updateLikeNum = function (commid, cb) {
    this.findById(commid, function (err, result) {
        if (err) {
            return;
        }
        var likeNum = result[0].like_num;
        return this.updateOne({
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
        'create_time': -1
    }).populate([{
        path: "author_id",
        populate: {
            path: 'avatar_path'
        }
    }, {
        path: "reply",
        options: {
            sort: {
                'create_time': -1
            },
            limit: 10,
            skip: 0
        },
        populate: [{
            path: 'author_id',
            populate: {
                path: 'avatar_path'
            }
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