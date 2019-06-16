const UpdateLogSchema = require('../db/schema/updateLog');

/**
 * 添加一条日志
 * @param {Object} {userId,logContent} {用户id，日志内容}
 */
exports.insertOneUpdateLog = ({
  userId,
  logContent
}) => {
  return new Promise((resolve, reject) => {
    UpdateLogSchema.create({
      log_content: logContent,
      inc_log_account: userId
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    })
  })
}
/**修改日志显示状态 */
exports.removeUpdateLogById = (logId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await UpdateLogSchema.updateOne({
        _id: logId
      }, {
        $set: {
          is_delete: true
        }
      })
      resolve(result);
    } catch (err) {
      reject(err);
    }
  })
}
/**
 * 删除一条升级日志
 * @param {Object} {logId} 日志id
 */
exports.delUpdateLogById = ({
  logId
}) => {
  return new Promise((resolve, reject) => {
    UpdateLogSchema.remove({
      _id: logId
    }, (err, result) => {
      if (err) return reject(false);
      resolve(true);
    })
  })
}
/**修改更新日志
 * @method modifyUpdateLogById
 * @param {String} logId 日志id
 * @param {String} logCnt 日志内容
 */
exports.modifyUpdateLogById = (logId, logCnt) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await UpdateLogSchema.updateOne({
        _id: logId
      }, {
        $set: {
          log_content: logCnt
        }
      })
      resolve(result);
    } catch (err) {
      reject(err);
    }
  })
}
/**
 * 获取更新日志总条数
 * @method getUpdateLogTotal
 */
exports.getUpdateLogTotal = () => {
  return new Promise((resolve, reject) => {
    UpdateLogSchema.countDocuments().exec(function (err, count) {
      if (err) return reject(err);
      resolve(count);
    })
  })
}
/**
 * 获取日志列表
 * @method getUpdateLogList
 * @param {Object} {skip,limit,sort} {跳过数量，查询数量,排序方式} 
 */
exports.getUpdateLogList = function ({
  skip,
  limit,
  sort
}) {
  return new Promise((resolve, reject) => {
    UpdateLogSchema.find({}, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    }).skip(skip).limit(limit).sort({
      create_time: -1
    })
  })
}