;
(function ($, extName) {
  /**
   * 
   * @param {element} ele 
   * @param {options} opt 
   */
  function Func(ele, opt) {
    this.$table = ele;
    this.__DEFAULT__ = {
      'limit': 10,
      'btnNum': 5,
      /* 单页默认数量 */
      'updateDataURL': '',
      animation: '',
      /* 更新数据url */
      'delDataURL': '',
      /* 删除数据url */
      'process': '',
      /* 回调 */

    };
    this.options = $.extend({}, this.__DEFAULT__, opt);

  }
  Func.prototype = {
    init: function () {
      this.page = 1; /* 当前页数 */
      this.limit = this.options.limit; /* 显示数量 */
      this.pageReg = /(page-)+(\d+)/; /* 验证页数 */;
      this.btnNum = this.options.btnNum; /* 按钮数量 */
      this.delDataURL = this.options.delDataURL;
      this.data = {}; /* 请求数据 */
      this.readHistory();
      this.getNewDatas(); /* 更新数据 */
      this.delDataURL === null || this.delDataURL === '' ? '' : this.delDataFn();
      this.addEvent();
    },
    /* 获取浏览历史 通过sessionStorage*/
    readHistory: function () {
      if (!window.sessionStorage || !sessionStorage['pageInfo']) return;
      var pageInfo = JSON.parse(sessionStorage['pageInfo']);
      if (pageInfo.href !== window.location.href) return;
      typeof pageInfo.page === 'number' ? this.page = pageInfo.page : '';
      typeof pageInfo.limit === 'number' ? this.limit = pageInfo.limit : '';
    },
    byIsChanged: function () {
      var oGetVars = {};

      if (window.location.search.length > 1) {
        for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
          aItKey = aCouples[nKeyId].split("=");
          oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
        }
      }
      return !JSON.stringify(oGetVars) == "{}"
    },
    addEvent: function () {
      var $self = this;
      var $table = $self.$table;
      $tableWrap = $table.parent();
      $tableWrap.on('click', '.pagination>li>a', function () {
        var $this = $(this);
        if ($this.parent('li').hasClass('disabled')) return;
        var wrds = $this.attr('data-page');

        var exec = $self.pageReg.exec(wrds); /* 匹配 "page-"格式 */
        if (exec) {
          $self.page = Number(exec[2]); /* 赋值页数 */
        } else {
          if (wrds === 'prev') { /* 上翻 页数-1 */
            $self.page--;
          }
          if (wrds === 'next') { /* 下翻 页数+1 */
            $self.page++;
          }
        }
        $self.getNewDatas(); /* 获取数据 */

      });
      $tableWrap.on('click', '.btn-retry', function () {
        $self.retry();
      })
    },
    formatSearch: function (se) { /* 当前url参数转为对象 */
      if (typeof se !== "undefined") {
        se = se.substr(1);
        var arr = se.split("&"),
          obj = {},
          newarr = [],
          Reg = /([^\)]*)\[([^\)]*)\]/; /* 匹配  [内容] */
        $.each(arr, function (i, v) {
          newarr = v.split("=");
          if (typeof obj[newarr[0]] === "undefined") {
            var n0 = newarr[0];
            var exec = Reg.exec(n0); /* 匹配 by[id]=11形式 */
            if (exec) {
              if (typeof obj['by'] === "undefined") {
                obj['by'] = {};
              }
              var key = exec[2];
              obj.by[key] = newarr[1];
              return;
            }
            obj[newarr[0]] = newarr[1];
          }
        });
        return obj;
      }
    },
    getData: function () {
      this.data = this.formatSearch(window.location.search); /* 从问号 (?) 开始的 URL（查询部分）*/
      this.data.page = this.page; /* 页数 */
      this.data.limit = this.limit; /* 单页数量 */
      var hostname = window.location;
      var pageInfo = {
        href: window.location.href,
        page: this.page,
        limit: this.limit
      }
      sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo));
    },
    getNewDatas: function () {
      var $self = this;
      var $table = $self.$table;

      this.getData();
      var process = this.Ajax_process;
      requestAjax({
        el: $table.find('tbody'),
        url: this.options.updateDataURL,
        data: JSON.stringify(this.data),
        aniEle: this.options.animation,
        contentType: "application/json;charset=utf-8"
      }, function (result) {
        $tbody = $table.find('tbody');
        $tbody.empty();
        if (result.status !== 1 || result.data === null || result.data.length === 0) return $tbody.html('没有数据');;
        var pro = $self.options.process(result);
        $tbody.html(pro.addHtml);
        $self.refreshPaginator(pro.Count);
      })
    },
    delDataFn: function () { /* 删除数据操作 */
      var $self = this;
      var $table = $self.$table;
      var artid = ''; /* 文章id */
      var $delBtnMod = $('#delArc_btn'); /* 模态框确认按钮 */
      $table.on('click', '.del-art-btn', function () { /* 单击事件 监听删除按钮 */
        artid = $(this).attr('data-artid'); /* 获取文章id并赋值 */
      })
      $delBtnMod.on('click', function () { /* 单击事件 监听模态框确认按钮 */
        var data = {
          "artid": artid
        };
        /* 发起ajax请求 删除数据 */
        $.ajax({
          url: $self.delDataURL,
          data: data,
          type: 'post',
          success: function (result) { /* 响应并刷新 */
            if (result.status == 1) {
              alert('删除成功');
              $self.getNewDatas();
            };
            if (result.status == 0) {
              alert('删除失败：' + result.msg);
            }
          }
        })
      })
    },
    refresh: {

      gt: function ($self, totalPages) {
        var pg = $self.page;
        var nCon = '';
        if (totalPages - pg < $self.btnNum - 2) {
          for (var pgs = pg - (totalPages - pg); pgs <= totalPages; pgs++) {
            nCon += '<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-' + pgs + '">' + pgs + '</a></li>';

          }
        } else {
          for (var pgs = pg; pgs < pg + $self.btnNum - 2; pgs++) {
            nCon += '<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-' + pgs + '">' + pgs + '</a></li>';

          }
          nCon += '<li class="page-item disabled"><span class="page-link">...</span></li>';
          nCon += '<li class="page-item"><a class="page page-link" href="javascript:void(0);" data-page="page-' + totalPages + '">' + totalPages + '</a></li>';
        }


        return nCon;
      },
      equal: function ($self, totalPages) {
        var nCon = '<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-' + 1 + '">' + 1 + '</a></li>';
        nCon += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        for (var pgs = $self.page - ($self.btnNum - 3); pgs <= totalPages; pgs++) {
          nCon += '<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-' + pgs + '">' + pgs + '</a></li>'
        }
        return nCon;
      },
      lte: function ($self, totalPages) {
        var nCon = '';
        for (var pgs = 1; pgs <= totalPages; pgs++) {
          nCon += '<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-' + pgs + '">' + pgs + '</a></li>'
        }
        return nCon;
      }
    },
    refreshPaginator: function (Total) { /* 刷新分页器 */
      var $self = this;
      var $table = this.$table;
      var totalPages = Math.ceil(Total / $self.limit); /* 根据返回Total值 计算总页数 */


      var nCon = '<ul class="pagination">' +
        '<li class="page-item">' +
        '<a class="page-link btn-start" href="#" aria-label="Last"   data-page="page-' + 1 + '">' +
        '<i class="fa fa-angle-double-left"></i>' +
        '</a>' +
        '</li>' +
        '<li class="page-item">' +
        '<a href="javascript:void(0);" data-page="prev" class="btn-prev page-link" aria-label="上一页">' +
        '<i class="fa fa-angle-left"></i>' +
        '</a>' +
        '</li>';
      if ($self.page === totalPages && totalPages >= $self.btnNum) {
        nCon += $self.refresh.equal($self, totalPages);
      } else
        if (totalPages > $self.btnNum) {
          nCon += $self.refresh.gt($self, totalPages);
        } else
          if (totalPages <= $self.btnNum) {
            nCon += $self.refresh.lte($self, totalPages);
          }

      nCon += '<li class="page-item">' +
        '<a href="javascript:void(0);" data-page="next" class="btn-next page-link" aria-label="下一页">' +
        '<i class="fa fa-angle-right"></i>' +
        '</a>' +
        '</li>' +
        '<li class="page-item">' +
        '<a class="page-link btn-end" href="#" aria-label="Last"  data-page="page-' + totalPages + '">' +
        '<i class="fa fa-angle-double-right"></i>' +
        '</a>' +
        '</li>' +
        '</ul>';
      var $navig = $table.parent().find('.navigation');
      $navig.empty().append(nCon);
      $self.updatePageStyles($navig, totalPages); /* 更新按钮样式  */
    },
    updatePageStyles: function ($target, totalPages) {
      var $self = this;
      var $nextBtn = $target.find('.btn-next'),
        $prevBtn = $target.find('.btn-prev'),
        $pageBtn = $target.find('.page'),
        $startBtn = $target.find('.btn-start'),
        $endBtn = $target.find('.btn-end');

      $target.find('li').removeClass('disabled active');
      $pageBtn.each(function () {
        var $this = $(this);
        var wrds = $this.attr('data-page');
        var exec = $self.pageReg.exec(wrds);
        if (exec) {
          if (Number(exec[2]) === $self.page) {
            $this.parent('li').addClass('disabled active');
          }
        }
      })
      if ($self.page === 1) {
        $prevBtn.parent('li').addClass('disabled hidden');
        $startBtn.parent('li').addClass('disabled hidden');
      }
      if (totalPages === 1) {
        $prevBtn.parent('li').addClass('disabled hidden');
        $nextBtn.parent('li').addClass('disabled hidden');
      }
      if ($self.page === totalPages) {
        $nextBtn.parent('li').addClass('disabled hidden');
        $endBtn.parent('li').addClass('disabled hidden');
      }
    },
    retry: function () {
      return this.getNewDatas();
    }
  }
  $.fn[extName] = function (options) {
    var fn = new Func(this, options);
    return fn.init();
  }
})(window.jQuery, 'pagination')