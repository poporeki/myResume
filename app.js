var express=require('express');
var app=express();

app.set('view engine','ejs');
app.use(express.static('./public'));

app.use('/',function(req,res){
    res.render('index',{});
});
app.listen(2001,function(){
    console.log('server is running!');
})