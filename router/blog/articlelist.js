var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
router.get('/', function (req, res) {
  req.query.by ? req.query.by['is_delete'] = false : req.query['by'] = {
    'is_delete': false
  }
  articleMod.showArticleList(req, function (err, result) {
    if (err) return;
    var list = [];
    let artlist = result.arcList;
    for (var i = 0; i < artlist.length; i++) {
      var obj = {
        artid: artlist[i].id,
        title: artlist[i].title,
        source: artlist[i].source,
        create_time: artlist[i].time_create
      }
      list.push(obj);
    }
    res.render('blog/articlelist', {
      artList: list,
      typename: result.typename
    })
  })
})
router.post('/', function (req, res) {
  req.body.by ? req.body.by['is_delete'] = false : req.body['by'] = {
    'is_delete': false
  }
  articleMod.showArticleList(req, function (err, result) {
    if (err) return;
    var list = [];
    var artlist = result.arcList;
    if (artlist.length == 0) {
      res.json({
        status: 0,
        msg: '没有数据'
      });
      return;
    }
    for (var i = 0, len = artlist.length; i < len; i++) {
      var obj = {
        artid: artlist[i].id,
        title: artlist[i].title,
        source: artlist[i].source,
        create_time: artlist[i].time_create
      }
      list.push(obj);
    }
    res.json({
      status: true,
      msg: '',
      data: list
    });
  })
})
module.exports = router;