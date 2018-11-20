
const express = require('express'),
  router = express.Router();

const verify = require('../../../controllers/verify');

router.post('/getCaptcha', verify.refreshCaptcha);
router.post('/checkCaptcha', verify.checkCaptcha);
router.post('/checkUserName', verify.checkUserName);