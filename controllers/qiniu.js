const qiniu = require('qiniu');
const configs = require('../config/qiniu');

var accessKey = configs.accessKey;
var secretKey = configs.secretKey;
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
  scope: 'blog',
  returnBody: '{"key":"$(key)","ext":"$(ext)"}'
};



exports.getUpLoadToken = (req, res, next) => {
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken = putPolicy.uploadToken(mac);
  res.json({
    status: 1,
    token: uploadToken
  })
}