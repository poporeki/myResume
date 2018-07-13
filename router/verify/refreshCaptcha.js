var express = require('express');
var router = express.Router();

var drawCap = require('../../modules/drawCap');

router.post('/', function (req, res) {
    var result = drawCap(5);
    req.session.captcha = (result.str).toLowerCase();
    res.json({
        statue: true,
        msg: '',
        data: result.dataUrl
    });
})

module.exports = router;