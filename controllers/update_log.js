const moment = require('moment');

const updateLogMod = require('../modules/UpdateLog');

//显示日志页
exports.showUpdateLog = async (req, res, next) => {
  let logList = await updateLogMod.getAllUpdateLogList({});
  let arr = logList.map(val => {
    return {
      create_time: val.create_time = moment(val.create_time).format('YYYY-MM-DD'),
      log_content: val.log_content,
      log_id: val._id
    };
  })
  res.render('./blog/updatelog', {
    logList: arr
  });
}
//获取更新日志列表
exports.getUpdateLogList = async (req, res, next) => {
  let limit = parseInt(req.query.limit) || null;
  let skip = parseInt(req.query.skip) || null;
  let logList = await updateLogMod.getAllUpdateLogList({
    limit,
    skip
  });
  let arr = logList.map(val => {
    return {
      create_time: val.create_time = moment(val.create_time).format('YYYY-MM-DD'),
      log_content: val.log_content,
      log_id: val._id
    };
  })
  return res.json({
    status: 1,
    data: {
      logList: arr
    }
  })
}
//显示添加日志页
exports.showIncUpdateLog = (req, res, next) => {
  res.render('./backend/insertUpdateLog');
}
//添加日志
exports.postIncUpdateLog = async (req, res, next) => {
  let userId = req.session.user._id;
  let logCnt = req.body.log_content;
  if (!logCnt || logCnt === '' || logCnt === null) {
    return res.json({
      status: false,
      msg: '内容不能为空'
    })
  }
  try {
    await updateLogMod.insertOneUpdateLog({
      userId,
      logContent: logCnt
    });
    res.json({
      status: true,
      msg: 'success'
    })
  } catch {
    res.json({
      status: false,
      msg: 'error'
    })
  }
}
//删除日志
exports.postDelUpdateLog = async (req, res, next) => {
  let logId = req.body.log_id;
  if (!logId) return res.json({
    status: false,
    msg: '数据错误'
  });
  try {
    await updateLogMod.delUpdateLogById(logId);
    res.json({
      status: true
    })
  } catch {
    res.json({
      status: false,
      msg: '删除失败'
    })
  }

}
// 显示更新日志列表页
exports.showUpdateLogList = async (req, res, next) => {
  let logList = await updateLogMod.getAllUpdateLogList({});
  res.render('backend/updateLogList', {
    logList
  })
}