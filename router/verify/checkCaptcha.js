var express = require('express');
var router = express.Router();

/* 检查验证码 */
router.post('/', function (req, res) {
    var reqCaptcha = (req.body.str).toLowerCase();
    var sourceCaptcha = req.session.captcha;
    if (reqCaptcha == sourceCaptcha) {
        res.json(true)
    } else {
        res.json(false);
    }
});



module.exports = router;