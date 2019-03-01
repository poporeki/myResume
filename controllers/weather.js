
const IPMod = require('../common/IPModule.js');
const weatherMod = require('../common/weather');

exports.getTheDay = (req, res, next) => {
  let geolo = {};
  if (req.query.geolocation && req.query.geolocation !== '' && req.query.geolocation !== 'false'&&req.query.geolocation!==null) {
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