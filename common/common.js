const ipMod = require("./IPModule");

exports.errorFormatter = ({
  location,
  msg,
  param,
  value,
  nestedErrors
}) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${msg}`;
};
/* 获取客户端ip */
exports.getIP = req => {
  return new Promise((resolve, reject) => {
    ipMod(req, ipInfo => {
      let ip = ipInfo.ip;
      let address = ipInfo.city && ipInfo.region
        ? ipInfo.region + " " + ipInfo.city
        : "地球";
      resolve({ ip, address });
    });
  });
};
exports.get