const crypto = require("crypto"),
  moment = require("moment"),
  mongoose = require('mongoose');

const userSchema = require("../db/schema/userSchema"),
  getClientIP = require("../common/IPModule"),
  dbLoginRecord = require("../db/schema/userLoginRecord"),
  uploadFile = require('../db/schema/uploadFile');

module.exports = {
  /**根据id查找用户 
   * @param {String} id 用户id
   */
  findUserById: (id, cb) => {
    userSchema.findUserById(id, cb);
  },
  /**
   * 根据名字查找用户 
   * @param {String} name 用户名
   */
  findUser: (name, cb) => {
    userSchema.findByName(name, cb);
  },
  /**获取用户列表
   * 
   */
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
    userSchema.getUserList(obj, cb);
  },
  /* 比对密码 */
  checkUserPwd: (pars, cb) => {
    /* 比对数据库 */
    let comparisonPwd = () => {
      return new Promise((resolve, reject) => {
        userSchema.findByNP(pars, (err, result) => {
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
          let avatarPath;
          if (result.is_qiniu) {
            avatarPath = result.save_path
          } else {
            avatarPath = result.has_thumbnail ?
              `${data.save_path}thumbnail_${data.new_name}` :
              `${data.save_path}${data.new_name}`;
          }


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
    userSchema.updateUserPassword({
        name: username,
        pwd: password,
        newPwd: newPassword
      },
      cb
    );
  },
  /**
   * 检查用户名是否存在
   */
  userIsExists: (username) => {
    return new Promise((resolve, reject) => {
      userSchema.findByName(username, (err, result) => {
        if (err || result.length === 0) return resolve(false);
        return resolve(true);
      });
    })
  },
  /**
   * 创建用户
   * @param {object} param0 参数
   * @param {function} cb 回调函数
   */
  createUser: function ({
    uname,
    upwd,
    utel,
    upermissions,
    udate,
    ubirth,
    uemail,
    userAgent,
    ipInfo,
    userId
  }, cb) {
    /* 创建用户 */
    let createUser = pars => {
      return new Promise((resolve, reject) => {
        userSchema.create(pars, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
      });
    };
    let fn = async () => {
      let userIsExists = await this.userIsExists(uname);
      if (userIsExists) return cb(null, 1, '用户名已存在');
      let pwd = crypto.createHash("md5").update(upwd).digest("hex");
      var pars = {
        serial_num: 1,
        user_name: uname,
        password: pwd,
        tel_num: utel,
        email: uemail,
        birth: ubirth,
        permissions: upermissions,
        reg_time: moment().format(),
        reg_ip: ipInfo.ip,
        reg_country: ipInfo.country,
        reg_country_id: ipInfo.country_id,
        reg_city: ipInfo.city,
        reg_isp: ipInfo.isp,
        reg_region: ipInfo.region,
        reg_user_agent: userAgent,
        author_id: userId
      };
      let resultCreate = await createUser(pars);
      return cb(null, resultCreate);
    }
    fn().catch(err => cb(err, null));
  },

  /**
   * 记录登录时间
   * @param {'ObjectId'} userid 用户id
   * @param {object} userAgent 
   * @param {object} geoloInfo 用户地理信息
   * @param {function} cb 回调函数
   */
  pushLoginTime: function (userid, userAgent, geoloInfo, cb) {
    var ua = userAgent;
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
        ip: geoloInfo.ip,
        country: geoloInfo.country,
        city: geoloInfo.city,
        isp: geoloInfo.isp,
        region: geoloInfo.region
      },
      login_userAgent: ua.source
    };
    dbLoginRecord.create(pars, cb);
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
          .countDocuments()
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
  /**
   * 通过名字查询登陆记录
   * @method findUserLoginRecordByName
   * @param {String} username 用户名
   * @param {Function} cb 回调函数
   */
  findUserLoginRecordByName: function (username, cb) {
    /* 获取用户id */
    let getUserID = () => {
      return new Promise((resolve, reject) => {
        userSchema.findByName(username, function (err, result) {
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
  /**
   * 获取所有用户登陆记录 
   * @method findUserLoginRecordById
   * @param {Number} limit 查询数量
   * @param {Number} page 当前页数
   * @param {function} cb 回调
   */
  findUserLoginRecordById: function ({
    userid,
    limit,
    page
  }, cb) {
    let by = {};
    userid && (by['user_id'] = userid);
    limit = limit || 10;
    page = page || 1;
    let skip = page === 1 ? 0 : page * limit;
    //获取总数
    let getRecordsCount = () => {
      return new Promise((resolve, reject) => {
        dbLoginRecord.find(by).countDocuments().exec((err, result) => {
          if (err) return reject(err);
          return resolve(result);
        })
      })
    }
    //获取列表
    let getRecordsList = () => {
      return new Promise((resolve, reject) => {
        dbLoginRecord.find(by)
          .limit(limit)
          .skip(skip)
          .sort({
            'create_time': -1
          })
          .populate({
            path: "user_id"
          })
          .exec((err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
      })
    }
    let fn = async () => {
      let [count, list] = await Promise.all([getRecordsCount(), getRecordsList()])
      return cb(null, {
        count,
        list
      });
    }
    fn().catch(err => {
      return cb(err, null);
    })
  },
  /**
   * 获取所有用户登陆记录 
   * @method findAllUserLoginRecord
   * @param {Number} limit 查询数量
   * @param {Number} page 当前页数
   * @param {function} cb 回调
   */
  findAllUserLoginRecord: function (limit, page, cb) {
    //获取总数
    let getRecordsCount = () => {
      return new Promise((resolve, reject) => {
        dbLoginRecord.find({}).countDocuments().exec((err, result) => {
          if (err) return reject(err);
          return resolve(result);
        })
      })
    }
    //获取列表
    let getRecordsList = (count) => {
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
    let fn = async () => {
      let [count, list] = await Promise.all([getRecordsCount(), getRecordsList()])
      return cb(null, {
        count,
        list
      });
    }
    fn().catch(err => {
      return cb(err, null);
    })
  },
  /**
   * 更新用户信息
   * @method updateAccountInfo
   * @param {String} userid 用户id
   * @param {Object} {username,telnumber,email} 更改的信息
   */
  updateAccountInfo: (userid, {
    username,
    telnumber,
    email,
    avatar
  }) => {
    return new Promise((resolve, reject) => {
      let updateSet = {};
      username && username !== '' ? updateSet['user_name'] = username : '';
      telnumber && telnumber !== '' ? updateSet['tel_number'] = telnumber : '';
      email && email !== '' ? updateSet['email'] = email : '';
      (avatar && avatar !== '') && (updateSet['avatar_path'] = avatar);
      userSchema.update({
        _id: userid
      }, {
        $set: updateSet
      }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
};