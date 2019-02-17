const express = require('express'),
  router = express.Router();

router.get('/', (req, res, next) => {
  res.render('iresume/i_body', {
    pageTitle: '晏思凯的简历'
  });
})
router.get('/s', (req, res, next) => {
  res.render('iresume_swiper');
})

module.exports = router;