var os = require('os');
var _ = require('lodash');
var ps = require('current-processes');

exports.currently = function (cb) {
  return ps.get(function (err, processes) {

    var sorted = _.sortBy(processes, 'cpu');
    var top = sorted.reverse().splice(0, 20);
    var cpus = os.cpus();
    console.log('cpu核心数:' + cpus.length);
    var c = 0;
    for (var i = 0; i < top.length; i++) {
      console.log('应用名：' + top[i].name + '=== cpu使用率：' + top[i].cpu)
      c += top[i].cpu;
    }
    console.log('总共：' + c);
    var average = (c / cpus.length).toFixed('2');
    console.log(average);
    return cb(average);
  });
}


exports.getInfo = function () {
  var arch = os.arch();
  var freemem = os.freemem();
  var loadavg = os.loadavg();
  var totalmem = os.totalmem();
  var obj = {
    arch,
    freemem,
    loadavg,
    totalmem

  }
  return obj;
}
exports.geteMemUsage = function () {
  var freemem = os.freemem();
  var totalmem = os.totalmem();
  return ((totalmem - freemem) / totalmem).toFixed(2);
}
//Create function to get CPU information
function cpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0,
    totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for (var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length
  };
}

//Grab first CPU Measure
var startMeasure = cpuAverage();

exports.cpuAverage = function (cb) {
  //Set delay for second Measure

  setTimeout(function () {

    //Grab second Measure
    var endMeasure = cpuAverage();

    //Calculate the difference in idle and total time between the measures
    var idleDifference = endMeasure.idle - startMeasure.idle;
    var totalDifference = endMeasure.total - startMeasure.total;

    //Calculate the average percentage CPU usage
    var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

    //Output result to console
    /* console.log(percentageCPU + "% CPU Usage."); */
    return cb(percentageCPU);

  }, 100);
}