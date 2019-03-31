const request = require('request');
const qs = require('qs');
exports.getPage = (req, res, next) => {
  let page = req.query.page || 1;
  let postId = req.query.post_id || null;
  let type = '';
  switch (req.query.type) {
    case 'loadmore':
      type = "loadmore";
      break;
    default:
      type = "refresh";
  }
  let option = {
    type,
    post_id: postId,
    page
  }
  let strOption = qs.stringify(option);
  let requestURL = "https://api.tuchong.com/feed-app?os_api=22&device_type=MI&device_platform=android&ssmix=a&manifest_version_code=232&dpi=400&abflag=0&uuid=651384659521356&version_code=232&app_name=tuchong&version_name=2.3.2&openudid=65143269dafd1f3a5&resolution=1280*1000&os_version=5.8.1&ac=wifi&aid=0&";
  requestURL += strOption;
  request(requestURL, (err, result, body) => {
    if (result.statusCode !== 200) return res.json({
      status: false,
      msg: '数据请求失败'
    })
    return res.json(JSON.parse(body));
  })
}