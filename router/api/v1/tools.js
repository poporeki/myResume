const express = require('express'),
  router = express.Router();

const apiCtl = require('../../../controllers/api')

router.get('/getregion', apiCtl.getRegion)
router.get('/getpostcode', apiCtl.getPostCode)

module.exports = router;