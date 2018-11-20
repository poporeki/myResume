var exec = require('child_process').exec;
var os = require('os');

function executionShell(s, cb) {
  exec(s, function (error, stdout, stderr) {
    if (error) return;

    return cb(stdout);
  })
}
/* 查询cpu使用率 */
exports.cpuUsage = function (cb) {
  var shell = "top -d 1 -cbn 5";
  executionShell(shell, function (cpuUsArr) {
    var stdout = cpuUsArr;
    var REG = /\%Cpu\(s\)\:\s+(.+)\s+us/g;
    var trim = /\s+(.+)\s+/;
    var cpuArr = stdout.match(REG);
    var lastAve = trim.exec(cpuArr[cpuArr.length - 1])[1];
    return cb(lastAve);
  });
}
/* 查询内存使用率 */
exports.memonyUsage = function (cb) {
  var shell = "df -h | grep '/dev/sda1' | awk -F '[ %]+' '{print $5}'";
  executionShell(shell, cb);
}
/* 查询磁盘使用率 */
exports.diskUsage = function (cb) {
  if (os.platform() === 'win32') return cb(0);
  var shell = "df -h | grep '/dev/xvda1' | awk -F '[ %]+' '{print $5}'";
  executionShell(shell, function (usage) {
    usage = usage.replace(/[\r\n]/g, "");
    return cb(usage);
  });
}