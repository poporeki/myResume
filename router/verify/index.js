var express = require('express');
var router = express.Router();

router.use('/checkUserName', require('./checkUserName'));
router.use('/refreshCaptcha', require('./refreshCaptcha'));
router.use('/checkCaptcha', require('./checkCaptcha'));
module.exports = router;