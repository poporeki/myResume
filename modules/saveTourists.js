var TouristsMod = require('../modules/Tourists');
var getClientIP = require('./getClientIP');
var moment = require('moment');

function saves(req) {
    var getIPinfo;
    getClientIP(req, function (result) {
        getIPinfo = result;
        var hisIP = getIPinfo.ip;
        console.log('返回的' + getIPinfo);
        var userAgent = req.headers['user-agent'] || 'not';
        var host = req.headers['host'] || 'not';
        var pars = {
            permissions: 'Tourists',
            reg_ip: hisIP,
            isp: getIPinfo.isp,
            country: getIPinfo.country,
            country_id: getIPinfo.country_id,
            city: getIPinfo.city,
            region: getIPinfo.region,
            reg_user_agent: userAgent,
            coming_time: moment().format(),
            host: host
        };
        TouristsMod.saveVistor(pars, function (err) {
            if (err) return;
            console.log('--------数据已记录-----------' + 'is TOURIISTS!');
            return;
        })



    });



}
module.exports = saves;