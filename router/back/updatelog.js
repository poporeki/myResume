const express = require('express'),
  router = express.Router();

const updateLogCtl = require('../../controllers/update_log');


router.get('/', updateLogCtl.showUpdateLogList);
router.get('/insert', (req, res, next) => {
  res.render('backend/insertUpdateLog');
})
//插入一条日志
router.post('/insert', updateLogCtl.postIncUpdateLog);
//修改一条日志
router.post('/modify', updateLogCtl.postModifyUpdateLogById)

router.post('/remove', updateLogCtl.postRemoveUpdateLog);

module.exports = router;