const UpdateLogSchema=require('../db/schema/updateLog');

exports.insertOneUpdateLog=({userId,logContent})=>{
  return new Promise((resolve,reject)=>{
    UpdateLogSchema.create({
      log_content:logContent,
      inc_log_account:userId
    },(err,result)=>{
      if(err) return reject(err);
        resolve(result);
    })
  })
}
/* 删除一条升级日志 */
exports.delUpdateLogById=({logId})=>{
  return new Promise((resolve,reject)=>{
    UpdateLogSchema.remove({_id:logId},(err,result)=>{
      if(err) return reject(false);
      resolve(true);
    })
  })
}
/* 获取更新日志列表 */
exports.getAllUpdateLogList=function({skip,limit,sort}){
  return new Promise((resolve,reject)=>{

    UpdateLogSchema.find({},(err,result)=>{
      if(err) return reject(err);
      resolve(result);
    }).skip(skip).limit(limit).sort({
      create_time:-1
    })
  })
}