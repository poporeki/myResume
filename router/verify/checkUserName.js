var express = require('express');
var router = express.Router();
var userMod = require('../../modules/User');

/* 检查用户名 */
router.post('/', function (req, res) {
    var getUname = req.body.username;
    userMod.findUser(getUname, function (err, result) {
        if (err) return;
        if (result.length == 0) {
            res.json(true);
        } else {
            res.json(false);
        }
    })
})

module.exports = router;