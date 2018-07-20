function refreshPaginator($el, artCount) {
  var totalPages = Math.ceil(artCount / 10); /* 根据返回artCount值 计算总页数 */
  var disabled = totalPages == 1 ? ' disabled' : '';
  var nCon = '<ul class="pagination">' +
    '<li class="page-item' + disabled + '">' +
    '<a href="javascript:void(0);" data-page="prev" class="btn-prev page-link" aria-label="上一页">' +
    '<span aria-hidden="true">&laquo;</span>' +
    '</a>' +
    '</li>';

  for (var pgs = 1; pgs <= totalPages; pgs++) {
    nCon += '<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-' + pgs + '">' + pgs + '</a></li>'
  }
  nCon += '<li class="page-item' + disabled + '">' +
    '<a href="javascript:void(0);" data-page="next" class="btn-next page-link" aria-label="下一页">' +
    '<span aria-hidden="true">&raquo;</span>' +
    '</a>' +
    '</li>' +
    '</ul>';
  var $navig = $el.parent().find('.navigation');
  $navig.empty().append(nCon);
  var $nextBtn = $navig.find('.btn-next'),
    $prevBtn = $navig.find('.btn-prev'),
    $pageBtn = $navig.find('.page');

  $navig.find('li').removeClass('disabled active');
  $pageBtn.each(function () {
    var $this = $(this);
    var wrds = $this.attr('data-page');
    var exec = RegP.exec(wrds);
    if (exec) {
      if (Number(exec[2]) === page) {
        $this.parent('li').addClass('disabled active');
      }
    }
  })
  if (page === 1) {
    $prevBtn.parent('li').addClass('disabled');
  }
  if (totalPages === 1) {
    $prevBtn.parent('li').addClass('disabled');
    $nextBtn.parent('li').addClass('disabled');
  }
  if (page === totalPages) {
    $nextBtn.parent('li').addClass('disabled');
  }
}
/* 当前url参数转为对象 */
function formatSearch(se) {
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
}