const mongoose=require('mongoose');

const updateLog=new mongoose.Schema({
  log_content:String,
  inc_log_account:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'myweb_user'
  }
},{
  timestamps:{
    createdAt:'create_time',
    updatedAt:'upadte_time'
  }
});


const UpdateLog=mongoose.model('update_log',updateLog);

module.exports=UpdateLog;
