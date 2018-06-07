/* ajax 添加loading动画 
    options：配置
    func：success时候的执行函数
    callback：返回错误
    type:默认post
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
      var $target = _this.el.find('.loading-ani');
      if ($target.length === 0) return;
      $target.remove();
    }
  }
  fn.prototype.xhr = function (_this) {
    $.ajax({
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
          _this.xhr.abort(); // 超时后中断请求
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