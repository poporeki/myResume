var mongoose=require('mongoose');
var moment=require('moment');

var userSchema=new mongoose.Schema({
    'permissions':String,
    'reg_ip':String,
    'reg_user_agent':String,
    'coming_time':[],
    'host':[]
},{timestamps:{
    createdAt: 'create_time', 
    updatedAt: 'update_time'
}});

userSchema.statics.findWeek=function(cb){
    var nowDay=moment().format();
    var sevenDaysAgo = moment().subtract(7,'days').format();
    var reg=new RegExp('/['+nowDay-+']['+nowDay-+']/')
    return this.find({coming_time:{ "$gte" : sevenDaysAgo, "$lt" : nowDay }},cb);
}
userSchema.statics.visitorOfTheDay=function(cb){
    var nowDay=moment().format('YYYY-MM-DD');
    var reg=new RegExp(nowDay);
    return this.find({coming_time:reg},cb);
}
var User=mongoose.model('touristsTB',userSchema);

module.exports=User;