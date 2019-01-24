const express = require('express'),
  router = express.Router();

const saveTourists = require('../modules/saveTourists');

const userCtl = require('../controllers/user');

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

/* 权限 */
router.post('/auth', userCtl.auth);
/* 接口 */
router.use('/api', require('./api'));
/* 登陆 */
router.use('/login', require('./login'));
/* 简历 */
router.use('/iresume', require('./iresume'));
/* 注册 */
router.use('/reg', require('./registerAccount'));
/* 验证码操作 */
router.use('/verify', require('./verify'));
/* 后台管理 */
router.use('/backend', require('./back'));
/* 博客 */
router.use('/blog', require('./blog'));
/* 退出登陆 */
router.get('/logout', userCtl.logout);


router.get('*', (req, res, next) => {
  next(404);
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