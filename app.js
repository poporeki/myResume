var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var session = require('express-session');

var db = require('./db/config');

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(useragent.express());
var PORT = 80;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));
app.use(session({
  secret: 'bears',
  cookie: {
    maxAge: 1000 * 60 * 60
  },
  resave: true,
  saveUninitialized: false
}));
app.use('/', require('./router'));

app.use(function (err, req, res, next) {
  console.log(err);
  res.send('内部错误');
});
app.listen(PORT, function () {
  console.log('server is running!');
});
module.exports = PORT;