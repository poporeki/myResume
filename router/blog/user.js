const express = require('express'),
  router = express.Router();

const userCtl = require('../../controllers/user.js');

/* 判断是否登录 */
router.use('/', userCtl.isLogin);
/* 显示用户页面 */
router.get('/', userCtl.showUserHome);
/* 更新头像 */
router.post('/uploadAvatar', userCtl.updateAvatar);
module.exports = router;