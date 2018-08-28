const express = require('express'),
  router = express.Router(),
  moment = require('moment');

const articleTagMod = require('../../../modules/Article/articleTag');

router.get('/add', (req, res) => {
  res.render('./backend/add', {
    pageTitle: 'Tag标签',
    formAction: '/tag/add',
    userName: req.session.user.username
  })
})
router.post('/add', (req, res) => {
  articleTagMod.addArticleTag(req.body, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/backend');
  })
})
router.get('/list', (req, res) => {
  articleTagMod.findArticleTags(req.query, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    let datas = [];
    for (let i = 0; i < result.length; i++) {
      let data = result[i];
      let obj = {
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