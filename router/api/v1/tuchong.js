const express = require('express'),
  router = express.Router();

const tuchongCtl = require('../../../controllers/tuchong');

router.get('/', tuchongCtl.getPage);

module.exports = router;