var express = require('express');
var router = express.Router();

var userMod = require('../../modules/User');
var arcMod = require('../../modules/Article/article');
var Tourists = require('../../modules/Tourists');
var osMod = require('../../common/os');
var commentMod = require('../../modules/Article/articleComments')
var childProcess = require('../../common/child_process');

const blogCtl = require('../../controllers/blog');
/* 权限判断 */
router.use('/', (req, res, next) => {
  if (!req.session.user) return next(-9);
  if (req.session.user && req.session.user.permissions === 'admin' || req.session.user.permissions === 'root') {
    next();
  }
})


/* 后台主页 */
router.get('/', (req, res, next) => {
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

  /* 获取最后一次登陆信息 */
  function getLastLoginInfo(userId) {
    return new Promise((resolve, reject) => {
      userMod.getLastLoginInfo(userId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  /* 获取当日访问人数 */
  function getVistorTotal() {
    return new Promise((resolve, reject) => {
      Tourists.getVistorTotal('day', (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
  /* 获取磁盘使用率 */
  function getDiskUsage() {
    return new Promise((resolve, reject) => {
      childProcess.diskUsage((result) => {
        resolve(result);
      });
    })
  }
  /* 获取最后3篇文章信息 */
  function getArticleTitle() {
    return new Promise((resolve, reject) => {
      arcMod.getArticleTitle(3, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  }
  /* 获取文章总数 */
  function getArcCount() {
    let by = {
      is_delete: false
    }
    return new Promise(function (resolve, reject) {
      arcMod.getCount(by, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  }
  let fn = async () => {
    const renderObj = {
      pageTitle: '首页',
      userName: req.session.user.username
    }
    let userId = req.session.user._id;
    let [lastLogInfo,
      vistorTotal,
      diskUsage,
      arcTitle,
      arcTotal
    ] = await Promise.all([
      getLastLoginInfo(userId),
      getVistorTotal(),
      getDiskUsage(),
      getArticleTitle(),
      getArcCount()
    ])
    // let lastLogInfo = await getLastLoginInfo(userId)
    // let vistorTotal = await getVistorTotal();
    // let diskUsage = await getDiskUsage();
    // let arcTitle = await getArticleTitle();
    renderObj['lastLoginInfo'] = lastLogInfo;
    renderObj['vistorNum'] = vistorTotal;
    renderObj['diskUsage'] = diskUsage;
    renderObj['arclist'] = arcTitle;
    renderObj['arcTotal'] = arcTotal;
    if (req.xhr) {
      return res.json({
        status: 1,
        data: renderObj
      })
    }
    res.render('./backend/index', renderObj);
  }
  fn().catch(err => {
    next(err);
  })


})
/*get  获取浏览人数 */
router.get('/getVistorTotal', function (req, res, next) {
  /* 获取访问人数 */
  let getVistorTotal = (kind) => {
    return new Promise(function (resolve, reject) {
      Tourists.getVistorTotal(kind, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  //获取单位时间评论数量
  let getCommentCountOfDays = (kind) => {
    return new Promise((resolve, reject) => {
      commentMod.getTotalOfDays(kind, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  let fn = async () => {
    let kind = req.query.kind || 'day';
    let [vistorTotalArr,
      commentTotal
    ] = await Promise.all([
      getVistorTotal(kind),
      getCommentCountOfDays(kind)
    ]);
    return res.json({
      status: true,
      data: {
        vistorTotalArr,
        commentTotal
      }
    })
  }
  fn().catch(err => {
    next(err);
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


router.use('/updatelog', require('./updatelog'));
router.use('/art', require('./article/article'));
router.use('/regg', require('./register'));
router.use('/user', require('./user'));
router.use('/loginRecord', require('./loginRecord'));
module.exports = router;