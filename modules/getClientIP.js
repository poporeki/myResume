const request = require('request');
/* 获取客户端ip */
function getClientIp(req, callback) {
    var ipInfo = {};
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var Reg = /([1,9]{1}\d{0,2}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
    ipInfo.ip = ip.match(Reg);
    if (!ipInfo.ip) {
        ipInfo.ip = "未知领域";
        return callback(ipInfo);
    }

    ipInfo.ip = ipInfo.ip[0];
    console.log(`当前ip：${ipInfo.ip}`);
    /*淘宝ip接口 解析ip地址 */
    request.get('http://ip.taobao.com/service/getIpInfo.php?ip=' + ipInfo.ip, (error, response, body) => {
        if (error && response.statusCode !== 200) {
            return callback(ipInfo);
        }
        console.log(`内容为：${body}`);
        var datas = JSON.parse(body);
        if (datas.code === 1) return callback(ipInfo);
        var data = datas.data;
        ipInfo.country = data.country;
        ipInfo.country_id = data.country_id;
        ipInfo.city = data.city;
        ipInfo.region = data.region;
        ipInfo.isp = data.isp;
        return callback(ipInfo);
    })

};

module.exports = getClientIp;