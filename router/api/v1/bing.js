const express = require('express'),
  router = express.Router();

const bingCtl = require('../../../controllers/bing')

router.get('/', bingCtl.getTodayWallpaper);

module.exports = router;