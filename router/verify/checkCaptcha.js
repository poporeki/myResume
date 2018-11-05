var express = require("express");
var router = express.Router();

/* 检查验证码 */
router.post("/", (req, res) => {
  let reqCaptcha = req.body.str.toLowerCase();
  let sourceCaptcha = req.session.captcha;
  if (reqCaptcha === sourceCaptcha) {
    res.json(true);
  } else {
    res.json(false);
  }
});

module.exports = router;
