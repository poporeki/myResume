const express = require('express'),
  router = express.Router();

const tuchongCtl = require('../../../controllers/tuchong');

/**图虫接口 */
router.get('/', tuchongCtl.getPage);

module.exports = router;