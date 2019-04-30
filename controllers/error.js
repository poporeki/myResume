const express = require('express');
var app = express();
module.exports = (err, req, res, next) => {
  if (app.get("env") === "development") {
    console.error("Error", err);
    next(err);
  }

  if (req.method === 'OPTIONS') next();
  if (res.headersSent) {
    return next(err);
  }
  switch (err) {
    case -9:
      {
        if (req.xhr) {
          return res.json({
            status: -9,
            msg: '未登录'
          })
        }
        res.redirect('/login');
        break;
      }
    case -5:
      {
        if (req.xhr) {
          return res.json({
            status: -5,
            msg: '没有此操作权限'
          })
        }
        res.send('没有此项操作权限');
        break;
      }
    case -1:
      {
        res.status(500);
        if (req.xhr) {
          return res.json({
            status: -1,
            msg: '服务器错误'
          })
        }
        res.render('error', {
          error: err
        });
        break;
      }
    case -2:
      {
        if (req.xhr) {
          return res.json({
            status: -2,
            msg: '信息错误，请重试'
          })
        }
        res.send('信息错误，请重试');
        break;
      }
    case 404:
      {
        res.status(404);
        if (req.xhr || req.url.indexOf('/images/') !== -1) {
          return res.json({
            status: 404,
            msg: '没有找到相关信息'
          })
        }
        res.render('404');

      }
    default:
      {
        res.status(500);
        if (req.xhr) {
          return res.json({
            status: 500,
            msg: '服务器错误'
          })
        }

        res.render('error', {
          error: err
        });
      }
  }
  next();
}