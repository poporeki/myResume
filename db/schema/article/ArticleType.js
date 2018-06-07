var mongoose=require('mongoose');

var arcTypeSchema=new mongoose.Schema({
    type_name:String,
    author_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'myweb_user'
    }
},{timestamps:{
    createdAt: 'create_time', 
    updatedAt: 'update_time'
}});

var arc_type=mongoose.model('arc_type',arcTypeSchema);

module.exports=arc_type;