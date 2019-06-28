const express = require('express'),
  router = express.Router();

const qiniuCtl = require('../../../controllers/qiniu');

router.get('/upload/getToken', qiniuCtl.getUpLoadToken);

module.exports = router;