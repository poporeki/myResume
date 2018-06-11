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
    this.aniEle = this.options.aniEle || 'loading-ani';
    this.callback = callback;
    /* 发起ajax请求 */
    this.xhr(this);
  }
  fn.prototype.ajaxLoadingAnimate = {
    self: this,
    start: function (_this) {
      this.remove(_this);
      var addCon = '<div class=' + _this.aniEle + '></div>';
      _this.el.append(addCon);
    },
    remove: function (_this) {
      var $target = _this.el.find('.' + _this.aniEle);
      if ($target.length === 0) return;
      $target.remove();
    }
  }
  fn.prototype.xhr = function (_this) {
    _this.currentAjax = $.ajax({
      type: this.options.type || 'post',
      url: this.options.url,
      timeout: this.options.timeout || 30000,
      data: this.options.data,
      async: this.options.async || true,
      contentType: this.options.contentType,
      beforeSend: function () {
        _this.ajaxLoadingAnimate.start(_this);
      },
      error: _this.callback,
      complete: function (XMLHttpRequest, status) {
        if (status == 'timeout') {
          _this.currentAjax.abort(); // 超时后中断请求
          _this.ajaxLoadingAnimate.remove(_this);
          _this.el.empty().append('链接超时');
          return;
        }
        _this.ajaxLoadingAnimate.remove(_this);
      },
      success: _this.func
    });
  }
  return new fn(options, func, callback);

}