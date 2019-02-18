const express = require("express"),
  router = express.Router();

const updateLogCtl=require('../../controllers/update_log');

// 显示日志页
router.get('/',updateLogCtl.showUpdateLog);

module.exports=router;