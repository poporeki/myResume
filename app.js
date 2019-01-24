const express = require("express"),
  app = express(),
  path = require("path"),
  bodyParser = require("body-parser"),
  useragent = require("express-useragent"),
  session = require("express-session"),
  compression = require("compression"),
  /* gzip */
  moment = require("moment");

const socket = require("./router/back/socket");
const ERROR = require('./controllers/error');
/* 端口号 */
const PORT = 3000;

moment.locale("zh-cn");
/* mongodb启用 */
require("./db/config");
/* gzip */
/* app.use(compression()); */
/* body-parse */
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false
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
app.set("view engine", "ejs");
app.engine('ejs', require('ejs-mate'));
/* views 路径配置 */
app.set("views", path.join(__dirname, "./views"));
/* 静态文件路径配置 */
app.use(express.static(path.join(__dirname, "./public")));
app.use("v", express.static(path.join(__dirname, "./dist")));
//设置跨域访问
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://192.168.199.147:8081");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true"); //和客户端对应，必须设置以后，才能接收cookie.
  next();
});

/* session 配置 */
app.use(
  session({
    secret: "bears",
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
  console.log(`HTTP server is running! PORT:${PORT}`);
});
/* 启动websocket服务 */
socket.prepareSocketIO(server);
module.exports = PORT;