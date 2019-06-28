const moment = require("moment");

const commentMod = require('../modules/Article/articleComments')
const IPMod = require('../common/IPModule.js')

/**评论时间比较 */
let statusComment = time => {
  if (!time) return true;
  let now = moment();
  let diff = now.diff(time);
  return diff < 60000 ? false : true;
}
/**
 * 获取客户端ip 
 */
let getIP = req => {
  return new Promise(async (resolve, reject) => {
    let ipInfo = await IPMod.getClientGeoloInfo(req);
    let ip = ipInfo.ip;
    let address =
      ipInfo.city && ipInfo.region ?
      ipInfo.region + " " + ipInfo.city :
      "地球";
    resolve({
      req,
      ip,
      address
    });
  });
};
/**
 * 获取文章评论列表
 */
exports.getTop = (req, res, next) => {
  let getCommTop = () => {
    return new Promise((resolve, reject) => {
      commentMod.findCommentTop((err, resCommList) => {
        if (err) return reject(err);
        resolve(resCommList);
      })
    })
  }
  getCommTop().then(commlist => {
    return res.json(commlist);
  })
}
/* 用户是否已登录 */
/**
 * 获取用户登陆状态，并处理
 */
exports.isLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.json({
      status: -9,
      msg: "登陆失效"
    });
  }
  //对比上次评论时间
  if (!statusComment(req.session.commTime)) {
    return res.json({
      status: -1,
      msg: "评论间隔时间太短，请休息一下哦"
    });
  }
  next();
}

/**
 * 插入一条评论 
 */
exports.insertComment = (req, res) => {
  //评论内容
  let commText = req.body.comm_content.trim();
  //用户id
  let authorId = req.session.user._id;
  // 文章id
  let arcid = req.body.arc_id;
  // 设备标识
  let userAgent = req.useragent.source;
  if (commText === "") {
    return res.json({
      status: -1,
      msg: "内容不能为空"
    });
  }
  if (!arcid) {
    return res.json({
      status: -2,
      msg: '参数错误，提交失败'
    })
  }
  /**
   * 插入评论
   * @param {Object} param0 {ip,address}
   */
  let insertComment = ({
    ip,
    address
  }) => {
    return new Promise((resolve, reject) => {
      commentMod.insertOneComment({
          authorId,
          commText,
          arcid,
          userAgent,
          ip,
          address
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  };
  let fn = async () => {
    let ips = await getIP(req);
    let resultInserted = await insertComment(ips);
    //session中记录本地评论时间
    req.session.commTime = moment();
    let data = {
      arc_content: resultInserted.comment_text,
      like_num: resultInserted.like_num,
      username: req.session.user.username,
      user: req.session.user._id,
      submit_address: resultInserted.submit_address,
      floor: resultInserted.floor,
      create_time: moment(resultInserted.create_time).fromNow()
    };
    return res.json({
      status: true,
      msg: null,
      data
    });
  };
  fn().catch(err =>
    res.json({
      status: 0,
      errcode: 4004,
      msg: "获取错误"
    })
  );
}
/**
 * 插入一条评论回复 
 */
exports.insertReplyToComment = (req, res, next) => {
  //回复内容
  var commText = req.body.comm_content;
  if (commText.trim() === "") {
    return res.json({
      status: 0,
      errcode: 1001,
      msg: "内容不能为空"
    });
  }
  /**插入回复 */
  let insertReply = ({
    req,
    ip,
    address
  }) => {
    return new Promise((resolve, reject) => {
      let articleId = req.body.arc_id;
      let authorId = req.session.user._id;
      let commentId = req.body.commid;
      let to = req.body.reply_id;
      let userAgent = req.useragent.source;
      let commentContent = req.body.comm_content.trim();
      commentMod.insertOneReplyInComment({
          articleId,
          authorId,
          commentId,
          commentContent,
          to,
          userAgent,
          ip,
          address
        },
        (err, result) => {
          if (err) return reject(err);
          req.session.commTime = moment();
          resolve(result);
        }
      );
    });
  };
  /**获取回复列表 */
  let getReplyList = comm => {
    return new Promise((resolve, reject) => {
      commentMod.findCommentReplyById(comm, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  let fn = async () => {
    let ips = await getIP(req);
    let resultInsert = await insertReply(ips);
    if (resultInsert.to === undefined) {
      return res.json({
        status: true,
        msg: null,
        data: {
          arc_content: resultInsert.comment_text,
          like_num: resultInsert.like_num,
          username: req.session.user.username,
          user: req.session.user._id,
          submit_address: resultInsert.submit_address,
          floor: resultInsert.floor,
          create_time: moment(resultInsert.createdAt).format(
            "YYYY-MM-DD hh:mm:ss"
          )
        }
      });
    }
    let resultReplyList = await getReplyList(resultInsert.to);
    let rep = resultReplyList[0];
    let toUserId = rep.author_id._id;
    let toUserName = rep.author_id.user_name;
    let avatar = rep.author_id.avatar_path;
    let toAvatarPath = `${avatar.save_path}thumbnail_${avatar.new_name}`;
    res.json({
      status: true,
      msg: null,
      data: {
        arc_content: resultInsert.comment_text,
        like_num: resultInsert.like_num,
        username: req.session.user.username,
        user: req.session.user._id,
        submit_address: resultInsert.submit_address,
        to: {
          user: {
            id: toUserId,
            name: toUserName,
            avatar: toAvatarPath
          }
        },
        floor: resultInsert.floor,
        create_time: moment(resultInsert.createdAt).fromNow()
      }
    });
  };
  fn().catch(err => {
    return res.json({
      status: false,
      msg: "error"
    });
  });
}
/**
 * 通过文章id获取文章评论列表 
 */
exports.getCommentsByArcId = (req, res) => {
  let limit = parseInt(req.query.number) || 10; /* 返回数量 默认10*/
  let skip = parseInt(req.query.skip) || 0; /* 跳过数量 */
  // 文章id
  let arcid = req.query.arcid;
  if (!arcid) {
    return res.json({
      status: -2,
      msg: "文章id错误,数据获取失败"
    });
  }

  /**获取文章评论 */
  let getThisArcComments = () => {
    return new Promise((resolve, reject) => {
      commentMod.showThisArticleComments(
        limit,
        skip,
        arcid,
        (err, commsDatas) => {
          if (err) return reject(err);
          if (commsDatas === undefined || commsDatas.length === 0)
            return reject(-1);
          let commlist = commsDatas.map(comm => {
            let commUser = comm.author_id;
            let commReps = traversalReply(comm.reply);
            let uAvatarInfo = commUser.avatar_path;
            let commAvatar;
            if (uAvatarInfo) {
              if (uAvatarInfo.is_qiniu) {
                commAvatar = uAvatarInfo.save_path
              } else {
                commAvatar = uAvatarInfo.has_thumbnail ? uAvatarInfo.save_path + 'thumbnail_' + uAvatarInfo.new_name : uAvatarInfo.save_path + uAvatarInfo.new_name;
              }
            }
            return {
              // 评论id
              id: comm._id,
              // 评论人{用户名，头像}
              user: {
                name: commUser.user_name,
                avatar: commAvatar
              },
              // 评论地址
              submit_address: comm.submit_address,
              // 創建時間
              create_time: moment(comm.create_time).fromNow(),
              // 点赞数
              likeNum: comm.like_num,
              // 评论内容
              text: comm.comment_text,
              // 该评论的回复
              commReps: commReps,
              // 评论楼层
              floor: comm.floor
            };
          });
          resolve(commlist);
        }
      );
    });
  };
  /**
   * 遍历文章数组
   * @param {array} reply 返回的该文章评论回复 
   */
  function traversalReply(reply) {
    if (reply.length === 0) return
    let commReplyArr = [];
    for (let idx = 0, replylen = reply.length; idx < replylen; idx++) {
      let repUser = reply[idx].author_id;


      let uAvatarInfo = repUser.avatar_path;
      let repAvatar;
      if (uAvatarInfo) {
        if (uAvatarInfo.is_qiniu) {
          repAvatar = uAvatarInfo.save_path
        } else {
          repAvatar = uAvatarInfo.has_thumbnail ? uAvatarInfo.save_path + 'thumbnail_' + uAvatarInfo.new_name : '';
        }
      }
      let to = '';
      if (reply[idx].to) {
        let t = reply[idx].to;
        let uAvatarInfo = t.avatar_path;
        let toAvatar;
        if (uAvatarInfo) {
          if (uAvatarInfo.is_qiniu) {
            toAvatar = uAvatarInfo.save_path
          } else {
            toAvatar = uAvatarInfo.has_thumbnail ? uAvatarInfo.save_path + 'thumbnail_' + uAvatarInfo.new_name : '';
          }
        }

        to = {
          user: {
            id: t.author_id._id,
            name: t.author_id.user_name,
            avatar: toAvatar
          },
          id: t._id,
          arc_content: t.comment_text,
          likeNum: t.like_num,
          create_time: moment(t.create_time).fromNow(),
          submit_address: t.submit_address,
          floor: t.floor
        }
      }


      let obj = {
        user: {
          name: repUser.user_name,
          id: repUser._id,
          avatar: repAvatar
        },
        id: reply[idx]._id,
        arc_content: reply[idx].comment_text,
        likeNum: reply[idx].like_num,
        create_time: moment(reply[idx].create_time).fromNow(),
        submit_address: reply[idx].submit_address,
        to,
        floor: reply[idx].floor
      }
      commReplyArr.push(obj);
    }
    return commReplyArr;
  }
  // 错误处理
  let errProcess = (err) => {
    if (err === 0) {
      return res.json({
        status: 0,
        msg: "请求数据错误"
      });
    } else {
      return res.json({
        status: -1,
        msg: "没有相关数据"
      });
    }
  };
  let fn = async () => {
    let commsList = await getThisArcComments();
    return res.json({
      status: 1,
      data: commsList
    });
  };
  fn().catch(err => errProcess(err));
}