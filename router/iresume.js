var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {
    pageTitle: '晏思凯的简历'
  });
})

module.exports = router;