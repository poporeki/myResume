const express = require('express'),
  router = express.Router();

const tuchongCtl = require('../../../controllers/tuchong');

/**图虫接口 */
router.get('/', tuchongCtl.getPage);
router.get('/getdiscover', tuchongCtl.getDiscover);
router.get('/getcategory', tuchongCtl.getCategory);
router.get('/getCategoryNew', tuchongCtl.getCategoryNew);
module.exports = router;