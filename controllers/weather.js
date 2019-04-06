const IPMod = require('../common/IPModule.js');
const weatherMod = require('../common/weather');

/**
 * 获取当天天气
 */
exports.getTheDay = (req, res, next) => {
  let geolo = {};
  //如果地理信息不存在，则根据ip地址查询
  if (req.query.geolocation && req.query.geolocation !== '' && req.query.geolocation !== 'false' && req.query.geolocation !== null) {
    var g = "" + req.query.geolocation;
    geolo.geolocation = g;
  } else {
    let ip = IPMod.getClientIPAddress(req);
    geolo.ip = ip;
  }

  weatherMod.getWeather(geolo, (err, result) => {
    return res.json(result);
  })
}