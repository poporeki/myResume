/**
 * 验证码操作
 */
var express = require('express');
var router = express.Router();
/* 检查用户名 */
router.use('/checkUserName', require('./checkUserName'));
/* 刷新验证码 */
router.use('/refreshCaptcha', require('./refreshCaptcha'));
/* 对比验证码 */
router.use('/checkCaptcha', require('./checkCaptcha'));
module.exports = router;