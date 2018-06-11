var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleMod = require('../../modules/Article/article');
router.get('/', function (req, res) {
  articleMod.showArticleList(req, function (err, artlist) {
    if (err) return;
    var list = [];
    for (var i = 0; i < artlist.length; i++) {
      var obj = {
        artid: artlist[i]._id,
        title: artlist[i].title,
        source: artlist[i].source,
        create_time: moment(artlist[i].create_time).format('YYYY-MM-DD hh:mm:ss')
      }
      list.push(obj);
    }
    res.render('blog/articlelist', {
      artList: list
    })
  })
})
router.post('/', function (req, res) {
  articleMod.showArticleList(req, function (err, artlist) {
    if (err) return;
    var list = [];
    if (artlist.length == 0) {
      res.json({
        status: 0,
        msg: '没有数据'
      });
      return;
    }
    for (var i = 0; i < artlist.length; i++) {
      var obj = {
        artid: artlist[i]._id,
        title: artlist[i].title,
        source: artlist[i].source,
        create_time: moment(artlist[i].create_time).format('YYYY-MM-DD hh:mm:ss')
      }
      list.push(obj);
    }
    res.json({
      status: 1,
      msg: '',
      result: list
    });
  })
})
module.exports = router;