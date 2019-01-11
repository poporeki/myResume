const express = require('express'),
  router = express.Router(),
  moment = require('moment');

const articleTypeMod = require('../../../modules/Article/articleType');

router.get('/add', (req, res) => {
  res.render('./backend/add', {
    isType: true,
    pageTitle: '文章分类',
    formAction: '/type/add',
    userName: req.session.user.username
  });
})

router.post('/add', (req, res) => {
  if (req.session.user.permissions !== 'root') {
    return res.send('该账号没有权限');
  }
  if (!req.body.t_name && req.body.t_iconname) {
    res.send('提交失败');
  }
  let typeName = req.body.t_name;
  let iconName = req.body.t_iconname;
  articleTypeMod.addArticleType(typeName, iconName, (err, result) => {
    if (err) return next(err);
    res.redirect('/backend');
  })
});
router.get('/list', (req, res) => {
  articleTypeMod.findArticleType(req.query, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    let datas = [];
    for (let i = 0; i < result.length; i++) {
      let data = result[i];
      let obj = {
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