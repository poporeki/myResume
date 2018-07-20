$(function () {
  'use strict'
  var socket = io.connect(':3033');
  var cpuArr = [],
    memArr = [];
  var time = 0;
  var labels = [];
  var lableCpu = $('.cpu-value');
  var pbCpu = $('.cpu-pb');
  var chartdata = {
    labels: labels,
    series: [
      cpuArr,
      memArr
    ]
  };
  var ch1 = new Chartist.Line('#ch1', chartdata, {
    high: 100,
    low: 0,
    axisY: {
      onlyInteger: true
    },
    showArea: true,
    fullWidth: true,
    chartPadding: {
      bottom: 0,
      left: 0
    }
  });
  socket.on('cpuAverage', function (data) {
    if (arr.length > 20) {
      arr.shift();
      labels.shift();
    }
    lableCpu.text(data.cpuAverage);
    pbCpu.css('width', data.cpuAverage + '%');
    cpuArr.push(data.cpuAverage);
    memArr.push(data.memUsage);
    time += 2;
    labels.push(time + 's');
    console.log(data);
    ch1.update(chartdata);
    socket.emit('my other event', {
      my: 'data'
    });
  });
  ch1.on('draw', function (data) {
    if (data.type === 'line' || data.type === 'area') {
      data.element.animate({
        d: {
          begin: 1000 * data.index,
          dur: 2000,
          from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
          to: data.path.clone().stringify(),
          easing: Chartist.Svg.Easing.easeOutQuint
        }
      });
    }
  });
  // resize chart when container changest it's width
  new ResizeSensor($('.br-mainpanel'), function () {
    ch1.update();
    ch1.update();
  });



});