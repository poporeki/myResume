var mongoose = require('mongoose');
/**
 * 
 */
var articleSchema = new mongoose.Schema({
    title: String,
    attribute: [],
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'arc_type'
    }],
    read: Number,
    content: String,
    support: Number,
    Tag: [],
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myweb_user'
    }
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time'
    }
});

var ArticleList = mongoose.model('ArticleList', articleSchema);

module.exports = ArticleList;