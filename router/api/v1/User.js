const express = require('express'),
  router = express.Router();

const User = require('../../../controllers/user.js');
const Article = require('../../../controllers/user');

router.use('/', Article.isLogin);
router.get('/getUserInfo', User.showUserHome);
router.post('/uploadAvatar', Article.updateAvatar);
router.post('/changeUserPassword', User.updateUserPassword);
router.post('/updateAccountInfo', User.updateInfo);
router.post('/updateAvatar', User.updateAvatarDB);
router.get('/userList', User.getUserList);
router.get('/vistorlist', User.getVistorList);

module.exports = router;