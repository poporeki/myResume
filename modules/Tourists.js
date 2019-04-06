var moment = require('moment');
var Tourists = require('../db/schema/addTourists');

module.exports = {
  /**
   * 保存到数据库
   */
  saveVistor: (pars, cb) => {
    Tourists.create(pars, cb);
  },
  /**
   * 获取当天访问ip信息列表
   */
  getTheDayVistor: (cb) => {
    let nowDay = moment().format('YYYY-MM-DD');
    let reg = new RegExp(nowDay);
    Tourists.visitorOfTheDay(reg, cb);
  },
  /**
   * 获取当天访问数
   */
  getTheDayVistorTotal: (cb) => {
    if (arguments.length === 2) {

    }
    let nowDay = moment().format('YYYY-MM-DD');
    Tourists.visitorTotalOfTheDay(nowDay, cb);
  },
  /** 获取一段时间内的访问数 */
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