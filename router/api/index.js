/*
 * @name: 接口
 * @Author: yansk 
 * @Date: 2018-11-01 21:34:24 
 * @Last Modified by: yansk
 * @Last Modified time: 2018-11-01 21:34:48
 */

const express = require('express');
const router = express.Router();

router.use('/v1', require('./v1'));
module.exports = router;