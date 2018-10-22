/**
 * 天气
 */
const express = require('express'),
  router = express.Router();

const getIP = require('../../modules/getIP');
const weatherMod = require('../../modules/weather');

router.get('/', (req, res, next) => {
  let geolo = {};
  if (req.query.geolocation && req.query.geolocation !== '' && req.query.geolocation !== 'false') {
    var g = "" + req.query.geolocation;
    geolo.geolocation = g;
  } else {
    let ip = getIP(req);
    geolo.ip = ip;
  }

  weatherMod.getWeather(geolo, (err, result) => {
    return res.json(result);
  })
})

module.exports = router;