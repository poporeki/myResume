const express = require('express'),
  router = express.Router();

const sign = require('../controllers/user').sign;

router.get('/', sign.showSignIn);
router.post('/', sign.signInCheck, sign.signIn);

module.exports = router;