const moment = require('moment');

const updateLogMod = require('../modules/UpdateLog');

//显示日志页
exports.showUpdateLog = async (req, res, next) => {
  let logList = await updateLogMod.getUpdateLogList({});
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
  let logList = await updateLogMod.getUpdateLogList({
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
  let logCnt = (req.body.log_content).trim();
  if (!logCnt || logCnt === '' || logCnt === null) {
    return res.json({
      status: 0,
      msg: '内容不能为空'
    })
  }
  try {
    await updateLogMod.insertOneUpdateLog({
      userId,
      logContent: logCnt
    });
    res.json({
      status: 1,
      msg: 'success'
    })
  } catch {
    res.json({
      status: 0,
      msg: 'error'
    })
  }
}
exports.postRemoveUpdateLog = async (req, res, next) => {
  let logId = req.body.log_id;
  if (!logId) return res.json({
    status: 0,
    msg: '数据错误'
  });
  try {
    await updateLogMod.removeUpdateLogById(logId);
    res.json({
      status: 1,
      msg: '移除成功'
    })
  } catch {
    res.json({
      status: 0,
      msg: '删除失败'
    })
  }
}
//删除日志
exports.postDelUpdateLog = async (req, res, next) => {
  let logId = req.body.log_id;
  if (!logId) return res.json({
    status: 0,
    msg: '数据错误'
  });
  try {
    await updateLogMod.delUpdateLogById(logId);
    res.json({
      status: 1
    })
  } catch {
    res.json({
      status: 0,
      msg: '删除失败'
    })
  }

}
//修改日志
exports.postModifyUpdateLogById = async (req, res, next) => {
  let userId = req.session.user._id;
  let logId = req.body.log_id;
  let logCnt = (req.body.log_content).trim();
  if (!logId || !logCnt || logCnt === '' || logCnt === null) {
    return res.json({
      status: 0,
      msg: '提交的内容不完整,修改失败'
    })
  }
  try {
    let result = await updateLogMod.modifyUpdateLogById(logId, logCnt);
    if (result.ok === 1) {
      return res.json({
        status: 1,
        msg: '修改成功'
      })
    }
    res.json({
      status: 0,
      msg: '修改失败'
    })
  } catch (err) {
    next(err);
  }
}
// 显示更新日志列表页
exports.showUpdateLogList = async (req, res, next) => {
  let limit = req.query.limit || 10;
  let page = req.query.page || 1;
  let skip = page === 1 ? 0 : limit * (page - 1);
  try {
    let logTotal = await updateLogMod.getUpdateLogTotal();
    let logList = await updateLogMod.getUpdateLogList({
      limit,
      skip
    })
    if (req.xhr) {
      return res.json({
        status: 1,
        data: {
          logTotal,
          logList
        }
      })
    }
    res.render('backend/updateLogList', {
      logList
    })
  } catch (err) {
    next(err);
  }

  // try {
  //   [logTotal, logList] = await Promise.all(updateLogMod.getUpdateLogTotal(), updateLogMod.getUpdateLogList({
  //     limit,
  //     skip
  //   }))
  // } catch (err) {
  //   console.log(err);
  // }

}