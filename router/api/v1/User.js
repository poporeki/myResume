const express = require('express'),
  router = express.Router();

const User = require('../../../controllers/user.js');
const Article = require('../../../controllers/user');

router.use('/', Article.isLogin);
router.post('/uploadAvatar', Article.updateAvatar);
router.post('/changeUserPassword', User.updateUserPassword);
router.post('/updateAccountInfo', User.updateInfo);

module.exports = router;