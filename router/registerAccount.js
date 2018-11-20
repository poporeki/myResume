const express = require('express'),
  router = express.Router();

const sign = require('../controllers/user').sign;

router.get('/', sign.showSignUp);
router.post('/', sign.signInCheck, sign.signUp);

module.exports = router;