const express = require("express"),
  app = express(),
  path = require("path"),
  bodyParser = require("body-parser"),
  useragent = require("express-useragent"),
  session = require("express-session"),
  compression = require("compression"),
  /* gzip */
  moment = require("moment"),
  xtpl = require('xtpl');

const socket = require("./router/back/socket");
const ERROR = require('./controllers/error');
/* 端口号 */
const PORT = 3000;

moment.locale("zh-cn");
/* mongodb启用 */
require("./db/config");
/* gzip */
/* app.use(compression()); */
app.locals.pretty = true;
/* body-parse */
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true
  })
);
app.use(
  bodyParser.json({
    limit: "50mb"
  })
);
/* userAgent */
app.use(useragent.express());

/* 模板引擎 ejs */
/* app.set("view engine", "ejs");
app.engine('ejs', require('ejs-mate')); */

/* 模板引擎 xtemplate */
app.set('view engine', 'xtpl');
/* views 路径配置 */
app.set("views", path.join(__dirname, "./views"));
/* 静态文件路径配置 */
app.use(express.static(path.join(__dirname, "./public")));
app.use("v", express.static(path.join(__dirname, "./dist")));
//设置跨域访问
app.use(function (req, res, next) {
  console.log(req.headers.origin);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Authorization,Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  //和客户端对应，必须设置以后，才能接收cookie.允许凭证,解决session跨域丢失问题
  res.header("Access-Control-Allow-Credentials", "true");
  req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});
/* session 配置 */
app.use(
  session({
    secret: "running",
    cookie: {
      maxAge: 1000 * 60 * 60 /* 1小时 */
    },
    resave: true,
    saveUninitialized: false
  })
);
/* 路由 */
app.use("/", require("./router"));
/* 错误处理 */
app.use(ERROR);
/* 启动https服务 */
// var server = https.createServer(options, app).listen(PORT, () => {
//   console.log('HTTPS server is running!');
// });
const server = app.listen(PORT, () => {
  console.log(`HTTP服务器正在运行中! 端口:${PORT}`);
});
/* 启动websocket服务 */
socket.prepareSocketIO(server);
module.exports = PORT;