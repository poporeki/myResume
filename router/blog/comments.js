const express = require("express"),
  router = express.Router();

const moment = require("moment");

const commentMod = require("../../modules/Article/articleComments");
const getIPInfoMod = require("../../common/IPModule");

/* 获取客户端ip */
let getIP = req => {
  return new Promise((resolve, reject) => {
    getIPInfoMod(req, ipInfo => {
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
  });
};
router.post("/submitComment", (req, res) => {
  if (!req.session.user) {
    return res.json({
      status: -9,
      msg: "登陆失效"
    });
  }
  if (!statusComment(req)) {
    return res.json({
      status: -1,
      msg: "评论间隔时间太短，请休息一下哦"
    });
  }
  let commText = req.body.comm_content.trim();
  if (commText === "") {
    return res.json({
      status: -1,
      msg: "内容不能为空"
    });
  }
  let authorId = req.session.user._id;
  let arcid = req.body.arc_id;
  let userAgent = req.useragent.source;
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
    req.session.commTime = moment();
    return res.json({
      status: true,
      msg: null,
      data: {
        art_content: resultInserted.comment_text,
        like_num: resultInserted.like_num,
        username: req.session.user.username,
        user: req.session.user._id,
        submitAddress: resultInserted.submit_address,
        floor: resultInserted.floor,
        create_time: moment(resultInserted.createdAt).fromNow()
      }
    });
  };
  fn().catch(err =>
    res.json({
      status: false,
      msg: "获取错误"
    })
  );
});
router.post("/submitReply", (req, res, next) => {
  if (!req.session.user) {
    return res.json({
      status: -9,
      msg: "登陆失效"
    });
  }
  if (!statusComment(req)) {
    return res.json({
      status: -1,
      msg: "评论间隔时间太短，请休息一下哦"
    });
  }
  var commText = req.body.comm_content;
  if (commText.trim() === "") {
    return res.json({
      status: -1,
      msg: "内容不能为空"
    });
  }
  /* 插入回复 */
  let insertReply = ({
    req,
    ip,
    address
  }) => {
    return new Promise((resolve, reject) => {
      let articleId = req.body.art_id;
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
  /* 获取回复列表 */
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
          art_content: resultInsert.comment_text,
          like_num: resultInsert.like_num,
          username: req.session.user.username,
          user: req.session.user._id,
          submitAddress: resultInsert.submit_address,
          floor: resultInsert.floor,
          create_time: moment(resultInsert.createdAt).format(
            "YYYY-MM-DD hh:mm:ss"
          )
        }
      });
    }
    let resultReplyList = await getReplyList(resultInsert.to);
    res.json({
      status: true,
      msg: null,
      data: {
        art_content: resultInsert.comment_text,
        like_num: resultInsert.like_num,
        username: req.session.user.username,
        user: req.session.user._id,
        submitAddress: resultInsert.submit_address,
        to: resultReplyList[0].author_id ?
          resultReplyList[0].author_id.user_name : "not",
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
});
router.post("/getComments", (req, res) => {
  let limit = parseInt(req.body.number || 10); /* 返回数量 默认10*/
  let skip = parseInt(req.body.skip || 0); /* 跳过数量 */
  if (!req.body.artid) {
    return res.json({
      status: false,
      msg: "文章id错误,数据获取失败"
    });
  }
  var artid = req.body.artid; /* 文章id */
  /* 获取文章评论 */
  let getThisArcComments = () => {
    return new Promise((resolve, reject) => {
      commentMod.showThisArticleComments(
        limit,
        skip,
        artid,
        (err, commsDatas) => {
          if (err) return reject(err);
          if (commsDatas === undefined || commsDatas.length === 0)
            return reject(0);
          let commlist = commsDatas.map(comm => {
            let commUser = comm.author_id;
            let commReps = traverseTheReply(comm.reply);
            let commAvatar = commUser.avatar_path ?
              commUser.avatar_path.save_path +
              "thumbnail_" +
              commUser.avatar_path.new_name :
              "";
            return {
              // 评论id
              id: comm._id,
              // 评论人{用户名，头像}
              user: {
                name: commUser.user_name,
                avatar: commAvatar
              },
              // 评论地址
              submitAddress: comm.submit_address,
              // 創建時間
              createTime: moment(comm.createdAt).fromNow(),
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
  /* 遍历评论回复 返回null或Array */
  let traverseTheReply = replys => {
    if (typeof replys === undefined || replys.length === 0) return null;
    return replys.map(reply => {
      let author = reply.author_id;
      let repAvatar = author.avatar_path ?
        author.avatar_path.save_path +
        "thumbnail_" +
        author.avatar_path.new_name :
        "";
      return {
        user: {
          name: author.user_name,
          id: author._id,
          avatar: repAvatar
        },
        id: reply._id,
        repContent: reply.comment_text,
        likeNum: reply.like_num,
        createTime: moment(reply.createdAt).fromNow(),
        submitAddress: reply.submit_address,
        to: reply.to ? reply.to : "",
        floor: reply.floor
      };
    });
  };
  /* 错误处理 */
  let errProcess = (err) => {
    if (err === 0) {
      return res.json({
        status: 0,
        msg: "没有相关数据"
      });
    } else {
      return res.json({
        status: -1,
        msg: "请求数据错误"
      });
    }
  };
  let fn = async () => {
    let commsList = await getThisArcComments();
    return res.json({
      status: true,
      data: commsList
    });
  };
  fn().catch(err => errProcess(err));
});
module.exports = router;

/* 评论时间比较 */
function statusComment(req) {
  if (req.session.commTime) {
    var now = moment();
    var diff = now.diff(req.session.commTime);
    if (diff < 60000) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}