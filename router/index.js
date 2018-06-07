var express = require('express');
var router = express.Router();
var saveTourists = require('../modules/saveTourists');
var addTourists = require('../db/schema/addTourists');

router.get('/', function (req, res) {
  if (!req.session.views) {
    req.session.views = 1;
    saveTourists(req);
  }
  res.render('index', {
    pageTitle: '晏思凯的简历'
  });
})

router.get('/bzonflash', function (req, res) {
  res.render('bz');
});


router.use('/login', require('./login'));
router.use('/backend', require('./back'));
router.use('/blog', require('./blog'));
router.get('*', function (req, res) {
  res.render('404');
})
router.post('*', function (req, res) {
  res.render('error');
})
module.exports = router;