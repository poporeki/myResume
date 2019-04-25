const express = require('express'),
  router = express.Router();

const moment = require('moment');

const userMod = require('../../modules/User');

/* 用户登录记录 */
router.get('/', (req, res, next) => {
  res.render('./backend/userLoginRecord', {
    pageTitle: '登陆记录',
    importScript: ['/js/back/loginRecord.js']
  });
});

router.post('/', function (req, res, next) {
  /* 获取登陆数据 */
  let getLoginDatas = () => {
    return new Promise((resolve, reject) => {
      let userid = req.body.userid || undefined;
      let limit = parseInt(req.body.limit || 10);
      let page = parseInt(req.body.page || 1);
      let data = {
        userid,
        limit,
        page
      };
      userMod.findUserLoginRecordById(data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  }
  getLoginDatas()
    .then((result) => {
      let arr = [];
      let list = result.list;
      for (let idx = 0, userLen = list.length; idx < userLen; idx++) {
        let user = list[idx];

        let username = user.user_id ? user.user_id.user_name : 'not',
          os = user.login_OS.name + ' \n ' + user.login_OS.version,
          /* 系統 */
          browser = user.login_browser.name + ' \n ' + user.login_browser.version,
          /* 浏览器 */
          country = user.login_geolocation.country ? user.login_geolocation.country : '',
          /* 国家 */
          region = user.login_geolocation.region ? user.login_geolocation.region : '',
          /* 地区 */
          city = user.login_geolocation.city ? user.login_geolocation.city : '',
          /* 城市 */
          isp = user.login_geolocation.isp ? user.login_geolocation.isp : 'NOT'; /* 互联网服务提供商 */
        arr.push({
          username: username,
          os: os,
          browser: browser,
          ip: user.login_geolocation.ip,
          address: country + ' ' + region + ' ' + city,
          isp: isp,
          logtime: moment(user.create_time).format('YYYY-MM-DD hh:mm:ss:ms')
        })
      }
      var obj = {
        count: result.count,
        list: arr
      }

      return res.json({
        status: 1,
        msg: '',
        data: obj
      })
    })
    .catch((err) => next(err));
});

module.exports = router;