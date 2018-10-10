const crypto = require("crypto"),
  moment = require("moment"),
  mongoose = require('mongoose');

const dbUser = require("../db/schema/userSchema"),
  getClientIP = require("./getClientIP"),
  dbLoginRecord = require("../db/schema/userLoginRecord"),
  uploadFile = require('../db/schema/uploadFile');

module.exports = {
  /* 根据id查找用户 */
  findUserById: (id, cb) => {
    dbUser.findUserById(id, cb);
  },
  /* 根据名字查找用户 */
  findUser: (name, cb) => {
    dbUser.findByName(name, cb);
  },
  /* 获取用户列表 */
  getUserList: (pars, cb) => {
    let obj = {
      by: pars.by ? pars.by : {},
      limit: pars.limit ? pars.limit : 0,
      skip: pars.page ? pars.page * obj.limit : 0,
      sort: pars.sort ?
        pars.sort : {
          reg_time: 1
        }
    };
    dbUser.getUserList(obj, cb);
  },
  /* 比对密码 */
  checkUserPwd: (pars, cb) => {
    /* 比对数据库 */
    let comparisonPwd = () => {
      return new Promise((resolve, reject) => {
        dbUser.findByNP(pars, (err, result) => {
          if (err) return cb(err, null);
          if (result.length === 0) return cb(null, false);
          let avatarId = result[0].avatar_path; /* 头像路径 */
          let userId = result[0]._id; /* 用户id */
          let permissions = result[0].permissions; /* 用户权限 */
          resolve({
            avatarId,
            userId,
            permissions
          });
        });
      })
    }
    /* 获取头像路径 */
    let getAvatarPath = (pars) => {
      return new Promise((resolve, reject) => {
        let obj = {
          user_id: pars.userId,
          avatar_path: false,
          permissions: pars.permissions
        }
        if (!pars.avatarId) return resolve(obj);
        uploadFile.findById(pars.avatarId, (err, result) => {
          if (err) return reject(err);
          if (result === null || !result) return reject(false);
          let data = result;
          let avatarPath = data.save_path + data.new_name;
          obj['avatar_path'] = avatarPath;
          return resolve(obj);
        })

      })
    }
    comparisonPwd()
      .then(getAvatarPath)
      .then((result) => cb(null, result))
      .catch((err) => cb(err, null));
  },
  /**
   * 修改密码
   *
   */
  updateAccountPassword: (pars, cb) => {
    let username = pars.username,
      password = pars.password,
      newPassword = pars.newPassword;
    password = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");
    newPassword = crypto
      .createHash("md5")
      .update(newPassword)
      .digest("hex");
    dbUser.updateUserPassword({
        name: username,
        pwd: password,
        newPwd: newPassword
      },
      cb
    );
  },
  /* 创建用户 */
  createUser: (req, pars, cb) => {
    /* 解析客户端ip */
    let getIP = () => {
      return new Promise((resolve, reject) => {
        getClientIP(req, result => {
          if (!result) reject(result);
          resolve(result);
        });
      });
    };
    /* 比对用户名是否存在 */
    let comparisonDBtoName = ip => {
      return new Promise((resolve, reject) => {
        let name = pars.reg_name,
          pwd = pars.reg_pwd,
          tel = pars.reg_tel || 0,
          permissions = pars.reg_permissions || "normal",
          nowDate = moment().format(),
          userAgent = pars.userAent || "not",
          hash = crypto.createHash("md5"),
          ip_info = ip;
        pwd = crypto
          .createHash("md5")
          .update(pwd)
          .digest("hex");

        let parms = {
          serial: moment().format("YYMMDD") + 1,
          username: name,
          password: pwd,
          tel_num: tel,
          permissions: permissions,
          now_date: nowDate,
          ip_info: ip_info,
          author: req.session.user ? req.session.user._id : undefined
        };
        dbUser.findByName(name, (err, result) => {
          if (err || result.length != 0) return cb(1, null);
          var pars = {
            serial_num: parms.serial,
            user_name: parms.username,
            password: parms.password,
            tel_num: parms.telnumber,
            permissions: parms.permissions,
            reg_time: parms.now_date,
            reg_ip: parms.ip_info.ip,
            reg_country: parms.ip_info.country,
            reg_country_id: parms.ip_info.country_id,
            reg_city: parms.ip_info.city,
            reg_isp: parms.ip_info.isp,
            reg_region: parms.ip_info.region,
            reg_user_agent: parms.userAgent,
            author_id: parms.author
          };
          resolve(pars);
        });
      });
    };
    /* 创建用户 */
    let createUser = pars => {
      return new Promise((resolve, reject) => {
        dbUser.create(pars, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
      });
    };
    getIP()
      .then(comparisonDBtoName)
      .then(createUser)
      .then(result => cb(null, result))
      .catch(err => cb(err, null));
  },
  /* 记录登陆时间 */
  pushLoginTime: function (req, userid, cb) {
    getClientIP(req, function (resIPinfo) {
      var ua = req.useragent;
      var pars = {
        user_id: userid,
        login_OS: {
          name: ua.platform,
          version: ua.os
        },
        login_browser: {
          name: ua.browser,
          version: ua.version
        },
        login_geolocation: {
          ip: resIPinfo.ip,
          country: resIPinfo.country,
          city: resIPinfo.city,
          isp: resIPinfo.isp,
          region: resIPinfo.region
        },
        login_userAgent: ua.source
      };
      dbLoginRecord.create(pars, cb);
    });
  },
  /* 查询登陆时间 */
  getLastLoginInfo: function (userid, cb) {
    /* 获取上次登录信息 */
    let getLastLogRecord = () => {
      return new Promise((resolve, reject) => {
        dbLoginRecord
          .find({
            user_id: userid
          })
          .sort({
            create_time: -1
          })
          .limit(2)
          .exec((err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return cb(0, null);
            let data = result[1];
            let lastLogin = {
              geolocation: data.login_geolocation,
              os: data.login_OS,
              login_time: moment(data.create_time).format("YYYY-MM-DD hh:mm:ss")
            };
            return resolve(lastLogin);
          })
      })
    }
    /* 获取登陆总数 */
    let getCount = (lastLogin) => {
      return new Promise((resolve, reject) => {
        dbLoginRecord
          .find({
            user_id: userid
          })
          .count()
          .exec(function (err, total) {
            if (err) return reject(err);
            lastLogin["loginTotal"] = total;
            return resolve(lastLogin);
          });
      })
    }
    getLastLogRecord()
      .then(getCount)
      .then((result) => cb(null, result))
      .catch((err) => cb(err, null));
  },
  findUserLoginRecordByName: function (username, cb) {
    /* 获取用户id */
    let getUserID = () => {
      return new Promise((resolve, reject) => {
        dbUser.findByName(username, function (err, result) {
          if (err) return reject(err);
          let userID = result[0]._id;
          return resolve(userID);
        });
      })
    }
    /* 获取用户信息 */
    let getUserInfo = () => {
      return new Promise((resolve, reject) => {
        dbLoginRecord.find({
            user_id: userID
          },
          (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          }
        );
      })
    }
    getUserID()
      .then(getUserInfo)
      .then(result => cb(null, result))
      .catch(err => cb(err, null));
  },
  /* 获取所有用户登陆记录 */
  findAllUserLoginRecord: function (limit, page, cb) {

    let getCount = () => {
      return new Promise((resolve, reject) => {
        dbLoginRecord.find({}).count().exec((err, result) => {
          if (err) return reject(err);
          return resolve(result);
        })
      })
    }
    let getInfo = (count) => {
      return new Promise((resolve, reject) => {
        let lim = limit || 10;

        let sk = page ?
          page === 1 ? 0 : page * lim :
          lim;
        dbLoginRecord.find({})
          .limit(lim)
          .skip(sk)
          .sort({
            'create_time': -1
          })
          .populate({
            path: "user_id"
          })
          .exec((err, result) => {
            if (err) return reject(err);
            result['count'] = count;
            resolve(result);
          });
      })
    }
    getCount().then(getInfo)
      .then((result) => {
        return cb(null, result);
      })
      .catch((err) => cb(err, null));
  },

};