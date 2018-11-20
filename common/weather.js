const http = require('http');
const request = require('request');



const KEY = '9e8d5b997a9d41273bc648fb2fb4d968';
exports.getWeather = (location, cb) => {

  let getAdcode = () => {
    return new Promise((resolve, reject) => {
      if (location.ip) {
        let url = 'https://restapi.amap.com/v3/ip?ip=' + location.ip + '&key=' + KEY;
        request.get(url, (err, result, resData) => {
          if (err) return reject(err);
          var toJSON = JSON.parse(result.body);
          resolve(toJSON.adcode);
        })
      } else if (location.geolocation || location.geolocation !== "false") {
        let lal = location.geolocation;
        let url = 'https://restapi.amap.com/v3/geocode/regeo?output=json&location=' + lal + '&key=' + KEY + '&radius=1000&extensions=all';
        request.get(url, (err, result, resData) => {
          if (err) return reject(err);
          var toJSON = JSON.parse(result.body);
          resolve(toJSON.regeocode.addressComponent ? toJSON.regeocode.addressComponent.adcode : null);
        })
      }

    })
  }
  let getWeather = (adcode) => {
    if (adcode === null || adcode.length === 0 || !adcode) adcode = 110105;
    return new Promise((resolve, reject) => {
      let url = 'https://restapi.amap.com/v3/weather/weatherInfo?&city=' + adcode + '&key=' + KEY;
      request.get(url, (err, result, resData) => {
        if (err) return reject(err);
        var toJSON = JSON.parse(result.body);
        resolve(toJSON);
      })
    })
  }
  getAdcode()
    .then(getWeather)
    .then(result => {
      cb(null, result);
    })
    .catch(err => {
      cb(err, null)
    })
}