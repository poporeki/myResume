const express = require('express'),
  router = express.Router();

const commentMod = require('../../modules/Article/articleComments')
router.get('/', (req, res, next) => {
  let getCommTop = () => {
    return new Promise((resolve, reject) => {
      commentMod.findCommentTop((err, resCommList) => {
        if (err) return reject(err);
        resolve(resCommList);
      })
    })
  }
  getCommTop().then(commlist => {
    return res.json(commlist);
  })
})

module.exports = router;