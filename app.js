const express = require('express'),
  app = express(),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  useragent = require('express-useragent'),
  session = require('express-session'),
  compression = require('compression'),
  os = require('os'),
  moment = require('moment');

moment.locale('zh-cn');
const socket = require('./router/back/socket');
/* https配置证书 */
let options;
if (os.platform() === 'win32') {
  options = {
    key: fs.readFileSync('d:/2_www.yansk.cn.key'),
    cert: fs.readFileSync('d:/1_www.yansk.cn_bundle.crt')
  };
}

if (os.platform() !== 'win32') {
  options = {
    key: fs.readFileSync('/etc/nginx/conf/2_www.yansk.cn.key'),
    cert: fs.readFileSync('/etc/nginx/conf/1_www.yansk.cn_bundle.crt')
  };
}
/* mongodb启用 */
const db = require('./db/config');
/* gzip */
app.use(compression());
/* body-parse */
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
/* useragent */
app.use(useragent.express());
/* 端口号 */
var PORT = 3000;
/* 模板引擎 ejs */
app.set('view engine', 'ejs');
/* views 路径配置 */
app.set('views', path.join(__dirname, './views'));
/* 静态文件路径配置 */
app.use(express.static(path.join(__dirname, './public')));
/* session 配置 */
app.use(session({
  secret: 'bears',
  cookie: {
    maxAge: 1000 * 60 * 60 /* 1小时 */
  },
  resave: true,
  saveUninitialized: false
}));
/* 路由 */
app.use('/', require('./router'));
/* 错误处理 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error');
});
/* 启动https服务 */
var server = https.createServer(options, app).listen(PORT, () => {
  console.log('server is running!');
});
/* 启动websocket服务 */
socket.prepareSocketIO(server);


module.exports = PORT;