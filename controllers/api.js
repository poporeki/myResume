const request = require('request');
const querystring = require("querystring");


/**
 * 获取地区列表
 */
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

/**获取邮编 */
exports.getPostCode = (req, res, next) => {
  if (!req.query.provinceid || !req.query.cityid || !req.query.areaid) return res.json({
    status: false,
    msg: '请求数据不完整'
  })
  /* 省份id */
  let provinceid = req.query.provinceid;
  /* 城市id */
  let cityid = req.query.cityid;
  /* 区县id */
  let areaid = req.query.areaid;
  /* 查询的地址 */
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