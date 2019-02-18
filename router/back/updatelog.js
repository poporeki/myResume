const express = require('express'),
  router = express.Router();

const updateLogCtl=require('../../controllers/update_log');

  router.get('/insert',(req,res,next)=>{
    res.render('backend/insertUpdateLog');
  })
  //插入一条日志
  router.post('/insert',updateLogCtl.postIncUpdateLog);
  router.get('/',updateLogCtl.showUpdateLogList);

module.exports = router;