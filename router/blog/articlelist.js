var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article'); /* 文章model */

const Article = require('../../controllers/article');

/* 获取文章列表 */
let getArticleList = (request) => {
  return new Promise((resolve, reject) => {
    articleMod.showArticleList(request, (err, result) => {
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


router.get('/', Article.getArticleListSSR);

/* post请求 文章列表 */
router.post('/', function (req, res) {
  req.body.by ? req.body.by['is_delete'] = false : req.body['by'] = {
    'is_delete': false
  }

  getArticleList(req).then(({
    arclist
  }) => res.json({
    status: true,
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