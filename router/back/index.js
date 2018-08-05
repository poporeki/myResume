var express = require('express');
var router = express.Router();

var userMod = require('../../modules/User');
var arcMod = require('../../modules/Article/article');
var Tourists = require('../../modules/Tourists');
var osMod = require('../../modules/os');
var childProcess = require('../../modules/child_process');
/* 权限判断 */
router.use('/', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  if ((req.session.user.permissions != 'admin') || !req.session.user.username) {
    res.redirect('/blog');
  }
  next();
})
/* 后台主页 */
router.get('/', (req, res) => {
  var nowUser = req.session.user ? req.session.user.username : 'test';

  var importStyle = {
    cdn: [
      'select2/4.0.0/css/select2.min.css',
      'chartist/0.11.0/chartist.min.css',
      'rickshaw/1.6.6/rickshaw.min.css'
    ]
  }
  var importScript = [
    'https://cdn.bootcss.com/chartist/0.11.0/chartist.min.js',
    'https://cdn.bootcss.com/socket.io/2.1.1/socket.io.js',
    '/js/back/ResizeSensor.js',
    '/js/back/dashboard.js'
  ];
  userMod.getLastLoginInfo(req.session.user._id, function (err, loginInfo) {
    Tourists.getVistorTotal('day', function (err, vistor) {
      childProcess.diskUsage(function (diskUsage) {
        arcMod.getArticleTitle(3, function (err, arclist) {
          if (err) {
            return;
          }
          res.render('./backend/index', {
            pageTitle: '首页',
            userName: req.session.user.username,
            lastLoginInfo: loginInfo,
            vistorNum: vistor,
            arclist,
            diskUsage,
            importStyle,
            importScript
          });
        });

      });

    });

  })

})
/*get  获取浏览人数 */
router.get('/getVistorTotal', function (req, res, next) {
  var kind = req.query.kind || 'day';
  Tourists.getVistorTotal(kind, function (err, result) {
    if (err) {
      return 0;
    }
    return res.json({
      status: true,
      data: result
    })
  });

});
/* 登出 */
router.get('/logout', function (req, res) {
  req.session.user = null;
  return res.redirect('/login');
});
/* 注册 */
router.get('/regg', function (req, res) {
  res.render('./backend/regAdmin', {
    pageTitle: '注册'
  });
});
router.use('/art', require('./article'));
router.use('/regg', require('./register'));
router.use('/user', require('./user'));
router.use('/loginRecord', require('./loginRecord'));
module.exports = router;