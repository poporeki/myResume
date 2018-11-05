var express = require('express');
var router = express.Router();
var userMod = require('../../modules/User');

/* 检查用户名 */
router.post('/', function (req, res, next) {
    let getUname = req.body.username;
    userMod.findUser(getUname, function (err, result) {
        if (err) return next(err);
        if (result.length === 0) {
            res.json(true);
        } else {
            res.json(false);
        }
    })
})

module.exports = router;