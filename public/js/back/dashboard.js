$(function () {
  var socket = io();
  var cpuArr = [],
    labels = [],
    memArr = [],
    timeCount = 0;

  var lableCpu = $('.cpu-value');
  var pbCpu = $('.cpu-pb');
  var lableMem = $('.mem-value');
  var pbMem = $('.mem-pb');

  var $v_s_blk = $('.views-switch-block');
  var $viewsTotal = $('.views-total');
  var views = {};
  var weekData, monthData;
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
  socket.on('hardware', function (data) {
    if (cpuArr.length > 10) {
      cpuArr.shift();
      memArr.shift();
      labels.shift();
    }
    timeCount += 5;

    var cpuUsage = data.cpuUsage;
    var memUsage = data.memUsage;
    lableCpu.text(cpuUsage);
    lableMem.text(memUsage);
    pbCpu.css('width', cpuUsage + '%');
    pbMem.css('width', memUsage + '%');
    cpuArr.push(cpuUsage);
    memArr.push(memUsage);
    labels.push(timeCount + 's');
    ch1.update(chartdata);
    socket.emit('my other event', {
      my: 'data'
    });
  });
  /* ch1.on('draw', function (data) {
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
  }); */
  var ch2 = new Chartist.Line('#rickshaw2', {
    labels: [1, 2, 3, 4, 5, 6, 7],
    series: []
  }, {
    high: 100,
    low: 0,
    showArea: true,
    showLine: false,
    showPoint: false,
    fullWidth: true,
    axisX: {
      showLabel: false,
      showGrid: false
    }
  });
  updateCh2('week');

  $v_s_blk.on('click', '.btn', function () {
    var $this = $(this);
    $(this).addClass('active').siblings().removeClass('active');
    if ($this.hasClass('week')) {
      $viewsTotal.text(views.week.total);
      ch2.update(views.week.chartData);

    } else if ($this.hasClass('month')) {
      if (!views.month) {
        updateCh2('month');
        return;
      }
      $viewsTotal.text(views.month.total);
      ch2.update(views.month.chartData);
    }

  })

  function updateCh2(days) {
    requestAjax({
      url: '/backend/getVistorTotal',
      data: {
        'kind': days
      },
      type: 'get',
      el: $('.widget-2>.card')
    }, function (result) {
      var total = 0;
      var datas = result.data;
      for (var i = 0; i < datas.length; i++) {
        total += datas[i];
      }
      views[days] = {
        total: total,
        chartData: {
          series: [
            result
          ]
        }
      }
      $viewsTotal.text(views[days].total);
      ch2.update(views[days].chartData);
    })

  }
  // resize chart when container changest it's width
  new ResizeSensor($('.br-mainpanel'), function () {
    ch1.update();
    ch1.update();
  });



});