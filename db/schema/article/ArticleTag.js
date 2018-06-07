var mongoose=require('mongoose');

var arcTypeSchema=new mongoose.Schema({
    tag_name:String,
    author_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'myweb_user'
    }
},{timestamps:{
    createdAt: 'create_time', 
    updatedAt: 'update_time'
}});

var ArcTags=mongoose.model('arc_tag',arcTypeSchema);

module.exports=ArcTags;