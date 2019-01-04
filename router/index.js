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
  var auth = {
    status: false
  };
  if (req.session.user) {
    auth.status = true;
    auth.info = {
      user: req.session.user
    }
  }
  res.json({
    auth
  });
})
router.use('/api', require('./api'));
router.use('/login', require('./login'));
router.use('/iresume', require('./iresume'));
router.use('/reg', require('./registerAccount'));
router.use('/verify', require('./verify'));
router.use('/backend', require('./back'));
router.use('/blog', require('./blog'));
router.get('/logout', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  req.session.destroy();
  res.json({
    status: true
  })

})
router.get('*', (req, res) => {
  if (req.xhr === true) {
    return res.json({
      status: 404,
      msg: '访问内容不存在'
    })
  }
  res.render('404');
})

router.post('*', (req, res) => {
  if (req.xhr === true) {
    return res.json({
      status: 500,
      msg: '服务器错误'
    })
  }
  res.render('error');
})
module.exports = router;