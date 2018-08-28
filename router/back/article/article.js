const express = require('express'),
  router = express.Router();


const articleMod = require('../../../modules/Article/article');
const articleTypeMod = require('../../../modules/Article/articleType');
const articleTagMod = require('../../../modules/Article/articleTag');
const uploadIMGMod = require('../../../modules/uploadIMG');

const scriptlink = require('./arclist_script');

router.post('/uploadArtIMG', (req, res, next) => {
  uploadIMGMod.upLoadIMG(req, '/images/upload/article/', (err, result) => {
    if (err) return next(err);
    return res.json({
      "errno": 0,
      "data": [result]
    })
  })
});



/* 显示所有文章 */
router.get('/articlelist', (req, res) => {
  res.render('./backend/articlelist', {
    pageTitle: "文章列表",
    userName: req.session.user.username,
    importScript: ['/js/back/articlelist.js']
  });
})
router.post('/articlelist', (req, res) => {
  let isDel = false;
  let referer = req.headers['referer'];
  if (referer.indexOf('articleTrash') > 0) {
    isDel = true;
  }
  req.body.by ? req.body.by['is_delete'] = isDel : req.body.by = {
    'is_delete': isDel
  };
  let resDatas = {};
  /* 获取总数 */
  function getArcCount() {
    return new Promise(function (resolve, reject) {
      articleMod.getCount(req, (err, result) => {
        if (err) {
          reject(err);
        }
        resDatas['artCount'] = result;
        resolve(result);
      });
    })
  }
  /* 获取文章列表 */
  function getArcList() {
    return new Promise(function (resolve, reject) {
      articleMod.showArticleList(req, (err, result) => {
        if (err) {
          reject(err);
        }
        resDatas['artInfo'] = result;
        resolve(result);
      });
    })
  }
  getArcCount().then(getArcList).then(function () {
    return res.json({
      status: 1,
      msg: '',
      data: resDatas
    });
  }).catch(function (err) {
    return res.json({
      status: 0,
      msg: '获取数据失败'
    })
  })

});
router.get('/articleTrash', (req, res, next) => {
  res.render('./backend/articlelist', {
    pageTitle: '文章回收站',
    modalTips: '确认删除吗，此操作无法恢复？！',
    importScript: ['/js/back/artlistTrash.js']
  })
});

router.get('/recoveryArticle/:id', (req, res, next) => {
  if (req.session.user.permissions !== 'root') {
    return res.json({
      status: 0,
      msg: '没有此操作权限'
    })
  }
  var arcid = req.params.id;
  articleMod.recoveryArticle(arcid, (err, result) => {
    if (err || !result) {
      return res.json({
        status: 0,
        msg: '操作失败'
      });
    }
    return res.json({
      status: 1,
      msg: '恢复成功'
    })
  })
});
router.use('/updatearticle', require('./article_update'));
router.use('/addArticle', require('./article_add'));
router.use('/type', require('./article_type'));
router.use('/tag', require('./article_tag'));
router.use('/remove', require('./article_remove'));
module.exports = router;