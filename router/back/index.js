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
  let nowUser = req.session.user ? req.session.user.username : 'test';
  let importStyle = {
    cdn: [
      'select2/4.0.0/css/select2.min.css',
      'chartist/0.11.0/chartist.min.css',
      'rickshaw/1.6.6/rickshaw.min.css'
    ]
  }
  let importScript = [
    'https://cdn.bootcss.com/chartist/0.11.0/chartist.min.js',
    'https://cdn.bootcss.com/socket.io/2.1.1/socket.io.js',
    '/js/back/ResizeSensor.js',
    '/js/back/dashboard.js'
  ];
  const renderObj = {
    pageTitle: '首页',
    userName: req.session.user.username,
    importStyle,
    importScript
  }
  /* 获取最后一次登陆信息 */
  function getLastLoginInfo() {
    return new Promise(function (resolve, reject) {
      userMod.getLastLoginInfo(req.session.user._id, function (err, result) {
        if (err) {
          return next(err);
          reject(err);
        }
        renderObj['lastLoginInfo'] = result;
        resolve(result);
      })
    })
  }
  /* 获取当日访问人数 */
  function getVistorTotal() {
    return new Promise(function (resolve, reject) {
      Tourists.getVistorTotal('day', function (err, result) {
        if (err) {
          return next(err);
          reject(err);
        }
        renderObj['vistorNum'] = result;
        resolve(result);
      });
    });
  }
  /* 获取磁盘使用率 */
  function getDiskUsage() {
    return new Promise(function (resolve, reject) {
      childProcess.diskUsage(function (result) {
        renderObj['diskUsage'] = result;
        resolve(result);
      });
    })
  }
  /* 获取最后3篇文章信息 */
  function getArticleTitle() {
    return new Promise(function (resolve, reject) {
      arcMod.getArticleTitle(3, function (err, result) {
        if (err) {
          next(err);
          reject(err);
        }
        renderObj['arclist'] = result;
        resolve(result);
      });
    })
  }
  getLastLoginInfo()
    .then(getVistorTotal)
    .then(getDiskUsage)
    .then(getArticleTitle)
    .then(function () {
      res.render('./backend/index', renderObj);
    });

})
/*get  获取浏览人数 */
router.get('/getVistorTotal', function (req, res, next) {
  let kind = req.query.kind || 'day';
  let resObj = {};
  /* 获取访问人数 */
  function getVistorTotal() {
    return new Promise(function (resolve, reject) {
      Tourists.getVistorTotal(kind, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
    })
  }
  getVistorTotal().then(function (result) {
    return res.json({
      status: true,
      data: result
    })
  }).catch(function (err) {
    return next(err);
  })


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

router.get('/test', (req, res, next) => {
  userMod.TEST(req.session.user._id, function (err, result) {
    if (err) {
      return next(err);

    }
    res.send(result);
  })
})
router.use('/art', require('./article/article'));
router.use('/regg', require('./register'));
router.use('/user', require('./user'));
router.use('/loginRecord', require('./loginRecord'));
module.exports = router;