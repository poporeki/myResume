var express = require('express');
var router = express.Router();
var moment = require('moment');

var articleTypeMod = require('../../modules/Article/articleType');

router.get('/add', function (req, res) {
  res.render('./backend/add', {
    pageTitle: '文章分类',
    formAction: '/type/add',
    userName: req.session.user.username
  });
})

router.post('/add', function (req, res) {
  if (req.session.user.permission !== 'root') {
    return res.send('该账号没有权限');
  }
  articleTypeMod.addArticleType(req.body, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/backend');
  })
});
router.get('/list', function (req, res) {
  articleTypeMod.findArticleType(req.query, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    var datas = [];
    for (var i = 0; i < result.length; i++) {
      var data = result[i];
      var obj = {
        id: data._id,
        name: data.type_name,
        timeCreate: moment(data.create_time).format('YYYY-MM-DD hh:mm:ss'),
        timeUpdate: moment(data.create_update).format('YYYY-MM-DD hh:mm:ss')
      }
      datas.push(obj);
    }
    res.render('./backend/articleTypeList', {
      pageTitle: '分类',
      identity: 'type',
      userName: req.session.user.username,
      info: datas
    });
  })
});

module.exports = router;