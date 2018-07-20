var exec = require('child_process').exec;

// 成功的例子
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

exports.memonyUsage = function (cb) {
  var shell = "df -h | grep '/dev/sda1' | awk -F '[ %]+' '{print $5}'";
  executionShell(shell, cb);
}

function executionShell(s, cb) {
  exec(s, function (error, stdout, stderr) {
    if (error) return;

    return cb(stdout);
  })
}