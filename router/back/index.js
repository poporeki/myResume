var express = require('express');
var router = express.Router();
var server = require('http').Server(express);
var io = require('socket.io')(server);

server.listen(3033);

var userMod = require('../../modules/User');
var Tourists = require('../../modules/Tourists');
var osMod = require('../../modules/os');
var childProcess = require('../../modules/child_process');

router.use('/', function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  if ((req.session.user.permissions != 'admin') || !req.session.user.username) {
    res.redirect('/blog');
  }
  next();
})

/*--------------------socket.io-----------------*/
io.on('connection', function (socket) {
  console.log('socket runing');
  /* 获取当前cpu使用率 */
  (function cpuAverage() {
    setTimeout(() => {
      /* console.log('get cpu');
      osMod.currently(function (cpuUs) {
        console.log(cpuUs);
        socket.emit('cpuAverage', {
          cpuAverage: cpuUs
        });
      }) */
      childProcess.cpuUsage(function (cpuUs) {
        socket.emit('cpuAverage', {
          cpuAverage: cpuUs,
          memUsage: osMod.geteMemUsage()
        });
      })
      /* osMod.cpuAverage(function (cpuUsage) {
        socket.emit('cpuAverage', {
          cpuAverage: cpuUsage
        });
      }); */
      cpuAverage();
    }, 3000);
  })();

  socket.on('my other event', function (data) {
    console.log(data);
  });
});

router.get('/', function (req, res) {
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
    Tourists.getTheDayVistor(function (vistor) {
      var osInfo = osMod.getInfo();
      res.render('./backend/index', {
        pageTitle: '首页',
        userName: req.session.user.username,
        lastLoginInfo: loginInfo,
        vistorNum: vistor.length,
        osInfo,
        importStyle,
        importScript
      });
    });

  })

})
router.get('/logout', function (req, res) {
  req.session.user = null;
  return res.redirect('/login');
});
router.get('/regg', function (req, res) {
  res.render('./backend/regAdmin', {
    pageTitle: '注册'
  });
});
/* router.use('/upload', require('../../modules/uploadIMG')); */
router.use('/art', require('./article'));
router.use('/regg', require('./register'));
router.use('/user', require('./user'));
router.use('/loginRecord', require('./loginRecord'));
module.exports = router;