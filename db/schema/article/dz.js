var mongoose=require('mongoose');

var arcTypeSchema=new mongoose.Schema({
    type_name:String,
    author_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'myweb_user'
    },
    article_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Article'
    },
    praise_num:Number
},{timestamps:{
    createdAt: 'create_time', 
    updatedAt: 'update_time'
}});

var Praised=mongoose.model('praised',arcTypeSchema);

module.exports=Praised;