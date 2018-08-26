const express = require('express'),
  router = express.Router();

const saveTourists = require('../modules/saveTourists'),
  addTourists = require('../db/schema/addTourists');

router.use('/', (req, res, next) => {
  res.locals['USER'] = req.session.user ? req.session.user : null;
  next();
})
router.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
    saveTourists(req);
  }
  res.redirect('/blog');
})

router.get('/bzonflash', (req, res) => {
  res.render('bz');
});

router.post('/auth', (req, res) => {
  var auth = false;
  if (req.session.user) {
    auth = true;
  }
  res.json(auth);
})

router.use('/login', require('./login'));
router.use('/iresume', require('./iresume'));
router.use('/reg', require('./registerAccount'));
router.use('/verify', require('./verify'));
router.use('/backend', require('./back'));
router.use('/blog', require('./blog'));
router.get('/logout', (req, res) => {
  req.session.destroy();
  return res.redirect('/blog');
})
router.get('*', (req, res) => {
  res.render('404');
})

router.post('*', (req, res) => {
  res.render('error');
})
module.exports = router;