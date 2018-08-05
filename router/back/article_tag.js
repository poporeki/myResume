var express = require('express');
var router = express.Router();
var moment = require('moment');
var articleTagMod = require('../../modules/Article/articleTag');

router.get('/add', function (req, res) {
  res.render('./backend/add', {
    pageTitle: 'Tag标签',
    formAction: '/tag/add',
    userName: req.session.user.username
  })
})
router.post('/add', function (req, res) {
  articleTagMod.addArticleTag(req.body, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/backend');
  })
})
router.get('/list', function (req, res) {
  articleTagMod.findArticleTags(req.query, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    var datas = [];
    for (var i = 0; i < result.length; i++) {
      var data = result[i];
      var obj = {
        id: data._id,
        name: data.tag_name,
        timeCreate: moment(data.create_time).format('YYYY-MM-DD hh:mm:ss'),
        timeUpdate: moment(data.create_update).format('YYYY-MM-DD hh:mm:ss')
      }
      datas.push(obj);
    }
    res.render('./backend/articleTypeList', {
      pageTitle: 'Tag标签',
      identity: 'tag',
      userName: req.session.user.username,
      info: datas
    });
  })
});
module.exports = router;