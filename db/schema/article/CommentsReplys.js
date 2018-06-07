var mongoose=require('mongoose');

var commentReplySchema=new mongoose.Schema({
    comment_text:String,
    like_num:{
        type:Number,
        default:0
    },
    floor:{
        type:Number,
        default:0
    },
    submit_address:String,
    author_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'myweb_user'
    },
    article_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Article'
    },
    comment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'commentReply'
    }
},{
    timestamps:{
        createAt:'create_time',
        updateAt:'update_time'
    }
});

commentReplySchema.statics.insertOneReply=function(pars,cb){
    return this.create(pars,cb);
}

var Comments=mongoose.model('commentReply',commentReplySchema);

module.exports=Comments;