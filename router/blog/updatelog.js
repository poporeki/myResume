const express = require("express"),
  router = express.Router();

const updateLogCtl = require('../../controllers/update_log');

// 显示日志页
router.get('/', updateLogCtl.showUpdateLog);
//获取更新日志列表
router.get('/getlist', updateLogCtl.getUpdateLogList);
module.exports = router;