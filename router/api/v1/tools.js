const express = require('express'),
  router = express.Router();

const apiCtl = require('../../../controllers/api')

/**获取地区列表 */
router.get('/getregion', apiCtl.getRegion)
/**获取邮编  */
router.get('/getpostcode', apiCtl.getPostCode)

module.exports = router;