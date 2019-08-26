const express = require('express'),
  router = express.Router(),
  socket_io = require('socket.io');

const osMod = require('../../common/os'),
  childProcess = require('../../common/child_process');

/* websocket */
exports.prepareSocketIO = function (server) {
  var io = socket_io.listen(server);
  io.sockets.on('connection', function (socket) {

    console.log('socket connecting');
    /* 获取当前cpu使用率 每3秒查询一次*/
    (function cpuAverage() {
      if (socket.disconnected) return;
      setTimeout(() => {
        childProcess.cpuUsage((cpuUs) => {
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