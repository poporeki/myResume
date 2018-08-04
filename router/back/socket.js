var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');

var osMod = require('../../modules/os');
var childProcess = require('../../modules/child_process');

exports.prepareSocketIO = function (server) {
  var io = socket_io.listen(server);
  io.sockets.on('connection', function (socket) {

    console.log('socket runing');
    /* 获取当前cpu使用率 每三秒查询一次*/
    (function cpuAverage() {
      if (socket.disconnected) return;
      setTimeout(() => {
        childProcess.cpuUsage(function (cpuUs) {
          socket.emit('hardware', {
            cpuUsage: cpuUs,
            memUsage: osMod.geteMemUsage()
          });
        })
        cpuAverage();
      }, 3000);
    })();

  });

};