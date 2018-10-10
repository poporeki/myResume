var express = require('express'),
  router = express.Router(),
  request = require('request');

const KEY = 'gCBVGzr8e1TUhUB1VSU9dD274Rg7hgsG';
router.get('/', (req, res) => {
  var ip = req.query.ip;
  let url = 'https://api.map.baidu.com/location/ip?ip=' + ip + '&ak=' + KEY;
  request.get(url, (err, result, resStr) => {
    let json = JSON.parse(result.body);
    return res.json(json);
  })
})

module.exports = router;