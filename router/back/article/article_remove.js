const express = require('express'),
  router = express.Router();

const arcMod = require('../../../modules/Article/article');

router.post('/', (req, res) => {
  if (req.session.user.permissions !== 'root') {
    return res.json({
      status: 0,
      msg: '没有此操作权限'
    })
  }
  arcMod.removeArticle(req.body.artid, (err, result) => {
    if (err) {
      return res.json({
        status: 0,
        msg: '错误'
      })
    };
    return res.json({
      status: 1,
      msg: ''
    })
  })
});
router.post('/toTrash', (req, res) => {
  if (req.session.user.permissions !== 'admin') {
    return res.json({
      status: 0,
      msg: '没有此操作权限'
    })
  }
  arcMod.moveToTrash(req.body.artid, (err, result) => {
    if (err) {
      return res.json({
        status: 0,
        msg: '操作失败'
      })
    }
    return res.json({
      status: 1,
      msg: '删除成功'
    })
  })
})
module.exports = router;