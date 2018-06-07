var dbUser=require('../db/schema/userSchema');

module.exports={
    findUser:function(name,cb){
        dbUser.findByName(name,cb);
    },
    checkUserPwd:function(params,cb){
        dbUser.findByNP(params,cb);
    },
    createUser:function(params,cb){
        dbUser.findByName(params.username,function(err,result){
            if(err|| result.length != 0 ) return cb(1,null);
            var pars={
                serial_num:params.serial,
                user_name: params.username,
                password:params.password,
                tel_num: params.telnumber,
                permissions:params.permissions,
                reg_time:params.now_date,
                reg_ip:params.ip_info.ip,
                reg_country:params.ip_info.country,
                reg_country_id:params.ip_info.country_id,
                reg_city:params.ip_info.city,
                reg_isp:params.ip_info.isp,
                reg_region:params.ip_info.region,
                reg_user_agent:params.userAgent,
                author_id:params.author
            };
            return dbUser.create(pars,cb);
        })
    },
    pushLoginTime:function(params,cb){
        dbUser.pushLoginTime(params,cb);
    },
    returnLoginTime:function(name,cb){
        dbUser.findByName(name,function(err,result){
            if(err) return cb(0,null);
            return cb(result[0].login_time||'登錄次數為0',null);
            
        })
    },
    
}