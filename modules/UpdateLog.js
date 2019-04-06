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
/**
 * 获取日志列表
 * @param {Object} {skip,limit,sort} {跳过数量，查询数量,排序方式} 
 */
exports.getAllUpdateLogList = function ({
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