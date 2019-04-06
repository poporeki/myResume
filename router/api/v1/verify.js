const express = require('express'),
  router = express.Router();

const verify = require('../../../controllers/verify');

/* 刷新验证码 */
router.post('/getCaptcha', verify.refreshCaptcha);
/* 比对验证码 */
router.post('/checkCaptcha', verify.checkCaptcha);
/* 检查用户名 */
router.post('/checkUserName', verify.checkUserName);