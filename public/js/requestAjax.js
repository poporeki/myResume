/**
 * *jQuery 添加loading动画
 * @param {object} options 配置参数
 * @param {object} func success执行的函数
 * @param {object} callback 返回错误
 */
function requestAjax(options, func, callback) {
  /* 添加删除等待动画 */
  function fn(options, func, callback) {
    this.options = options;
    this.el = this.options.el;
    this.func = func;
    this.timeout = this.options.timeout;
    this.timeoutFunc = this.options.timeoutFunc;
    this.aniEle = this.options.aniEle || "loading-ani";
    this.callback = callback;
    /* 发起ajax请求 */
    this.xhr();
  }
  fn.prototype.ajaxLoadingAnimate = {
    self: this,
    isClassName: function (aniCon) {
      var Reg = /<[^>]+>/;
      if (Reg.test(aniCon)) {
        return false;
      }
      return true;
    },
    addHtml: function (aniCon) {
      if (this.isClassName(aniCon)) {
        return "<div class=" + aniCon + "></div>";
      }
      return aniCon;
    },
    getClassName: function (aniCon) {
      if (this.isClassName(aniCon)) {
        return aniCon;
      }
      var str = aniCon;
      var Reg = /class=[\"|'](.*?)[\"|']/g;
      var tempt_result = Reg.exec(str);
      if (tempt_result.length === 0 || tempt_result !== null)
        return tempt_result[1];
      return "loading-ani";
    },
    start: function (_this) {
      this.remove(_this);
      var addCon = this.addHtml(_this.aniEle);
      _this.el.append(addCon);
    },
    remove: function (_this) {
      var className = this.getClassName(_this.aniEle);
      var $target = _this.el.find("." + className);
      if ($target.length === 0) return;
      $target.remove();
    }
  };
  fn.prototype.xhr = function () {
    var _this = this;
    _this.currentAjax = $.ajax({
      type: this.options.type || "post",
      url: this.options.url,
      timeout: this.options.timeout || 10000,
      data: this.options.data,
      async: this.options.async || true,
      contentType: this.options.contentType,
      beforeSend: function () {
        _this.ajaxLoadingAnimate.start(_this);
      },
      error: _this.callback,
      complete: function (XMLHttpRequest, status) {
        if (status == "timeout") {
          _this.currentAjax.abort(); // 超时后中断请求
          _this.ajaxLoadingAnimate.remove(_this);
          var func = _this.timeoutFunc;
          if (func) {
            _this.el
              .empty()
              .append(
                '<a onclick="' +
                func +
                '();this.remove();" href="javascript:void(0);" style="text-align:center;">链接超时</a>'
              );
            return;
          }
          _this.el
            .empty()
            .append('<a href="##" class="btn-retry" style="text-align:center;">链接超时</a>');
          return;
        }
        _this.ajaxLoadingAnimate.remove(_this);
      },
      success: _this.func
    });
  };
  return new fn(options, func, callback);
}