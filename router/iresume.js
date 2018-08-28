const express = require('express'),
  router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: '晏思凯的简历'
  });
})

module.exports = router;