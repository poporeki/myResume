var moment = require('moment');
var Tourists = require('../db/schema/addTourists');

module.exports = {
  saveVistor: (pars, cb) => {
    Tourists.create(pars, cb);
  },
  getTheDayVistor: (cb) => {
    let nowDay = moment().format('YYYY-MM-DD');
    let reg = new RegExp(nowDay);
    Tourists.visitorOfTheDay(reg, cb);
  },
  getTheDayVistorTotal: (cb) => {
    if (arguments.length === 2) {

    }
    var nowDay = moment().format('YYYY-MM-DD');
    Tourists.visitorTotalOfTheDay(nowDay, cb);
  },
  getFewDaysVistor: function (days, cb) {
    const arr = [];
    (function week(i, arr) {
      i++;
      if (i > days) return cb(null, arr);
      let d = moment().subtract(i, 'days').format('YYYY-MM-DD');
      Tourists.visitorTotalOfTheDay(d, function (err, result) {
        if (err) return 0;
        arr.push(result);

        week(i, arr)
      })
    })(0, arr);
  },
  getVistorTotal: function (kind, cb) {
    if (kind === 'day') {
      this.getTheDayVistorTotal(cb);
    } else if (kind === 'week') {
      this.getFewDaysVistor(7, cb);
    } else if (kind === 'month') {
      let curMonthDays = moment().daysInMonth();
      this.getFewDaysVistor(curMonthDays, cb);
    }
  }
}