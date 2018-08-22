var TouristsMod = require("../modules/Tourists");
var getClientIP = require("./getClientIP");
var moment = require("moment");

function saves(req) {
  let getIPinfo;
  /* 获取ip */
  let getIP = () => {
    return new Promise(resolve => {
      getClientIP(req, result => {
        getIPinfo = result;
        console.log("返回的" + getIPinfo);
        let userAgent = req.headers["user-agent"] || "not",
          host = req.headers["host"] || "not";
        var pars = {
          permissions: "Tourists",
          reg_ip: getIPinfo.ip,
          isp: getIPinfo.isp,
          country: getIPinfo.country,
          country_id: getIPinfo.country_id,
          city: getIPinfo.city,
          region: getIPinfo.region,
          reg_user_agent: userAgent,
          coming_time: moment().format(),
          host: host
        };
        resolve(pars);
      });
    });
  };
  /* 存入数据库 */
  let saveToDB = ipInfo => {
    return new Promise((resolve, reject) => {
      TouristsMod.saveVistor(ipInfo, function (err) {
        if (err) reject(err);
        console.log("--------数据已记录-----------" + "is TOURIISTS!");
        resolve();
      });
    });
  };
  getIP().then(saveToDB);
}
module.exports = saves;