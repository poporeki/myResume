var TouristsSchema=require('../db/schema/addTourists');

module.exports={
    getTheDayVistor:(cb)=>{
        TouristsSchema.visitorOfTheDay(function(err,result){
            if(err) return;
            return cb(result);
        });
    }
}