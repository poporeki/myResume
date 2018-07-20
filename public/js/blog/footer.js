$(function () {
  backToTopFn();
  listeningSearch();
  $('.sidebar-btn ').on('click', function () {
    var $this = $(this);
    var parTransform = $this.parent('.l-aside').css('transform');
    if (parTransform !== 'matrix(1, 0, 0, 1, 0, 0)') return;
    $this.addClass('go');
    $this.one('animationend', function () {
      window.location.href = '/blog/user';
    })
  })
});
/* 返回顶部 */
function backToTopFn() {
  var $backTopBtn = $('#back_to_top'); /* 按钮 */
  backToTop_showIt($backTopBtn); /* 显示隐藏 */
  $(document).on('mousewheel', function () { /* 页面滚动时 */
    backToTop_showIt($backTopBtn);
  })
  backToTop_listeningFn($backTopBtn); /* 监听按钮单击 */
}

function backToTop_showIt($el) {
  var sTop = $(window).scrollTop();
  var wHei = $(window).height();
  /* console.log('距离顶部高度：' + sTop, ',,窗口高度：' + wHei) */
  if (sTop - wHei > -wHei) {
    $el.fadeIn();
  } else {
    $el.fadeOut();
  }
}

function backToTop_listeningFn($el) {
  $el.on('click', function () {
    $("html,body").animate({
      scrollTop: 0
    })
  })
}

function listeningSearch() {
  /* search box */
  var $sBox = $('.search-box'),
    /* search box wrapper */
    $sWrap = $sBox.parent('.s-wrap'),
    /* search input */
    $sInput = $sBox.find('input.search'),
    /* input wrapper */
    $iptWrap = $sInput.parent('.input-box'),
    /* search button */
    $sBtn = $sBox.children('.s-btn'),
    /* message box */
    $msgBox = $iptWrap.children('.msg-box'),
    /* dropdown */
    $ddBox = $sWrap.children('.search-dropdown'),
    keyword = '';
  /* *监听键盘抬起 */
  $sInput.on('keyup focus blur', function () {
    var $this = $(this);
    keyword = $this.val(); /* 获取当前文字 */
    if (keyword === '') {
      $ddBox.removeClass('show').addClass('hide');
      $sWrap.trigger('mouseleave');
      return;
    };
    /* 发起ajax请求获取数据 */
    requestAjax({
      el: $iptWrap,
      url: '/blog/search/like',
      aniEle: 'loading-ani-searchlike',
      data: {
        wd: keyword
      }
    }, function (result) {
      var hCon = '';
      $ddBox.removeClass('show').addClass('hide');
      if (!result) {
        $msgBox.html('error');
        return;
      }
      if (result.status === 0) {
        hCon = 'null';

        /* $ddBox.empty().append(hCon); */
      }
      if (result.status === 1) {
        var data = result.data;
        $msgBox.html('');
        for (var i = 0; i < data.length; i++) {
          hCon += '<a class="arc-lk" href="/blog/article/' + data[i]._id + '">' + data[i].title + '</a>'
        }
        $ddBox.removeClass('hide').addClass('show').empty().append(hCon);
        console.log(data);
      }

    })
  });
  /**
   * *监听inputWrap鼠标移入移出
   */
  $sWrap.on('mouseenter', function () {
    $sBox.addClass('show');
  }).on('mouseleave', function () {
    if (keyword !== '' || $sInput.is(":focus")) return;
    $sBox.removeClass('show');
  });
  $(window).scroll(function () {
    var top = $(this).scrollTop();
    $(".parallax-window").css({
      transform: "translate3d(0px," + -(top / 3) + "px,0px)"
    }) //需要设置视差的元素
  });
}