var mongoose=require('mongoose');
mongoose.connect('mongodb://test:123456@198.148.106.33:27069/test',
function(err){
    if(err){
        console.log(err);
    }else{
        console.log('成功');
    }
});
  var db=mongoose.connection;
  db.once('open',function(){
    console.log('---------数据库已链接----------');
})


module.exports=db;