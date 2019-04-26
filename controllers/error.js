module.exports = (err, req, res, next) => {
  if (req.method === 'OPTIONS') next();
  console.log(err);
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
        if (req.xhr) {
          return res.json({
            status: -1,
            msg: '服务器错误'
          })
        }
        res.status(500);
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
        if (req.xhr) {
          return res.json({
            status: 404,
            msg: '没有找到相关信息'
          })
        }
        res.render('404');
      }
    default:
      {
        if (req.xhr) {
          return res.json({
            status: 500,
            msg: '服务器错误'
          })
        }
        res.status(500);
        res.render('error', {
          error: err
        });
      }
  }
}