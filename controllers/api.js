const request = require('request');
const querystring = require("querystring");

exports.getRegion = (req, res, next) => {
  let requestURL = 'http://cpdc.chinapost.com.cn/web/api.php?op=get_linkage&act=ajax_select&keyid=1&parent_id='
  // regionID
  let parent_id = req.query.parent_id || 0;
  requestURL += parent_id;
  request(requestURL, (err, result, body) => {
    if (result.statusCode !== 200) {
      return res.json({
        status: false,
        msg: '获取数据失败'
      })
    }
    return res.json({
      status: true,
      data: JSON.parse(body)
    })
  })
}

exports.getPostCode = (req, res, next) => {
  if (!req.query.provinceid || !req.query.cityid || !req.query.areaid) return res.json({
    status: false,
    msg: '请求数据不完整'
  })
  let provinceid = req.query.provinceid;
  let cityid = req.query.cityid;
  let areaid = req.query.areaid;
  let searchkey = req.query.searchkey;
  let apiUrl = 'http://cpdc.chinapost.com.cn/web/index.php?m=postsearch&c=index&a=ajax_addr&flag=1554204108303&dosubmit=1&';
  let options = {
    provinceid,
    cityid,
    areaid,
    searchkey
  }
  apiUrl += querystring.stringify(options);
  request(apiUrl, (err, result, body) => {
    if (err || result.statusCode !== 200) return res.json({
      status: false,
      msg: '获取失败'
    })
    return res.json({
      status: true,
      data: JSON.parse(body)
    })
  })
}