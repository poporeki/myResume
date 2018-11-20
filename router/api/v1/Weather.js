/**
 * 天气
 */
const express = require('express'),
  router = express.Router();

const weather = require('../../../controllers/weather.js')

router.get('/gettheday', weather.getTheDay);

module.exports = router;