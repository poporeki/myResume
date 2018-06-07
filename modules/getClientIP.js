var request=require('request');

function getClientIp(req,callback) {
    var ipInfo={};
    var ip=req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    var Reg=/([1,9]{1}\d{0,2}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
    ipInfo.ip=ip.match(Reg);
    if(!ipInfo.ip){
        ipInfo.ip="未找到有效ip";
        return callback(ipInfo);
    }

    ipInfo.ip=ipInfo.ip[0];
    request.get('http://ip.taobao.com/service/getIpInfo.php?ip='+ipInfo.ip,function(error, response, body){
        var datas=JSON.parse(body);
        if(datas.code==1) return;
        var data=datas.data;
        ipInfo.country=data.country;
        ipInfo.country_id=data.country_id;
        ipInfo.city=data.city;
        ipInfo.region=data.region;
        ipInfo.isp=data.isp;
        return callback(ipInfo);
    })
    
};

module.exports=getClientIp;