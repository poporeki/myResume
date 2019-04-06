var TouristsMod = require("../modules/Tourists");
var IPMod = require("../common/IPModule");
var moment = require("moment");

/**
 * 对访问ip进行保存 
 */
function saves(req) {
  /* 存入数据库 */
  let saveToDB = params => {
    return new Promise((resolve, reject) => {
      TouristsMod.saveVistor(params, function (err) {
        if (err) reject(err);
        console.log(`vistor|-- ${params.reg_ip} --| is saved `);
        resolve();
      });
    });
  };
  let fn = async () => {
    let userAgent = req.headers["user-agent"] || "not";
    let host = req.headers["host"] || "not";
    let IPInfo = await IPMod.getClientGeoloInfo(req);
    var pars = {
      permissions: "Tourists",
      reg_ip: IPInfo.ip,
      isp: IPInfo.isp,
      country: IPInfo.country,
      country_id: IPInfo.country_id,
      city: IPInfo.city,
      region: IPInfo.region,
      reg_user_agent: userAgent,
      coming_time: moment().format(),
      host: host
    };
    await saveToDB(pars);
  }
  fn();
}
module.exports = saves;