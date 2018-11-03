const express = require('express'),
  router = express.Router(),
  moment = require('moment');

var articleMod = require('../../../modules/Article/article'); /* 文章model */

/* 获取文章列表 */
let getArticleList = (params) => {
  return new Promise((resolve, reject) => {
    articleMod.showArticleList(params, (err, result) => {
      if (err) return reject(err);
      if (result === undefined) return reject(-1);
      let arclist = result.arcList;
      if (arclist.length == 0) return reject(0);
      let resListArr = arclist.map(arc => {
        return {
          /* 文章id */
          artid: arc.id,
          /* 文章标题 */
          title: arc.title,
          /* 文章html */
          source: arc.source,
          /* 文章创建时间 */
          create_time: arc.time_create
        }
      })
      resolve({
        /*分类 */
        typename: result.typename,
        /* 文章列表 */
        arclist: resListArr
      });
    })
  })
}


/* post请求 文章列表 */
router.get('/getlist', function (req, res) {
  let by = req.query.by || {};
  if (typeof by === 'string') {
    typeof by === 'string' && by ? by = JSON.parse(by) : by = {};
  }
  let limit = parseInt(req.query.num) || 10; /* 查找数量默认10 */
  let page = parseInt(req.query.page); /* 当前页数 */
  let sort = req.query.sort || {
    'create_time': -1
  }; /* 排序 默认创建时间倒叙 */
  let params = {
    by,
    limit,
    page,
    sort
  }
  let fn = async () => {
    let arclist = await getArticleList(params);
  }
  getArticleList(req).then(({
    arclist
  }) => res.json({
    status: 1,
    msg: '',
    data: arclist
  })).catch(err => {
    let obj = {
      status: false,
      msg: ''
    }
    if (err === 0) {
      obj['msg'] = '数据不存在'
    } else if (err === -1) {
      obj['msg'] = '数据获取失败'
    } else {
      obj['msg'] = '服务器错误'
    }
    return res.json(obj);
  })
})
module.exports = router;