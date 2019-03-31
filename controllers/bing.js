const request = require('request');

exports.getTodayWallpaper = (req, res, next) => {
  let mainURL = 'https://cn.bing.com';
  let requestUrl = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';
  request(requestUrl, (err, result, jss) => {
    if (err && result.statusCode !== 200 && result.body === '') {
      return res.json({
        status: false,
        msg: '获取壁纸失败'
      })
    }
    let json = JSON.parse(result.body);
    let url = mainURL + json.images[0].url;
    let urlbase = mainURL + json.images[0].urlbase
    res.json({
      status: true,
      data: {
        url,
        urlbase
      }
    })
  })
}