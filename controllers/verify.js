var validator = require('validator');

var drawCap = require('../common/drawCap');
/* 比对验证码 */
exports.checkCaptcha = (req, res) => {
  let reqCaptcha = req.body.str.toLowerCase();
  let sourceCaptcha = req.session.captcha;
  let resultBoolean = reqCaptcha === sourceCaptcha ? true : false;
  res.json(resultBoolean);
}
/* 比对用户名 */
exports.checkUserName = (req, res) => {
  let username = req.body.username;
  if (validator.isEmpty(username)) {
    res.json(false)
  }
  userMod.findUser(username, (err, result) => {
    if (err) return res.json(false);
    res.json(result.length === 0 ? true : false);
  })
}

exports.refreshCaptcha = (req, res) => {
  let captcha = drawCap(5);
  req.session.captcha = (captcha.str).toLowerCase();
  res.json({
    statue: true,
    msg: '',
    data: captcha.dataUrl
  });
}