function opt(_color, _num, _text, _fontSize) {
  return option = {
    color: [_color],
    series: [{
      name: '值',
      type: 'pie',
      clockWise: true, //顺时加载
      hoverAnimation: false, //鼠标移入变大
      radius: ['60%', '61%'],
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            show: false,
            length: 0,
            smooth: 0.5
          },
          borderWidth: 5,
          shadowBlur: 40,
          borderColor: _color,
          shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
        }
      },
      data: [{
        value: _num,
        /* name: _num + '0%' */
      }, {
        value: 10 - _num,
        name: '',
        itemStyle: {
          normal: {
            color: "rgba(0,0,0,0)",
            borderColor: "rgba(0,0,0,0)",
            borderWidth: 0
          }
        }
      }]
    }, {
      name: '白',
      type: 'pie',
      clockWise: true,
      hoverAnimation: true,
      radius: [100, 100],
      label: {
        normal: {
          position: 'center'
        }
      },
      data: [{
        value: 1,
        label: {
          normal: {
            formatter: _text,
            textStyle: {
              color: '#666666',
              fontSize: _fontSize
            }
          }
        }
      }]
    }]
  };
}
$(function () {
  document.body.addEventListener('touchstart', function () {});
  preloadImg(imgurl);
  var $page = $('.page-item'),
    $navbar = $('.navbar');
  /* 得到jQuery元素 n为父元素或索引，ele为查找的元素 */
  var get$Ele = function (n, ele) {
    if (typeof n === 'object') {
      return $(n).find(ele);
    }
    return $page.eq(n).find(ele);
  }
  var chartArr = [];

  function createEchars(el, ops) {
    var dom = document.getElementById(el);
    var myChart = echarts.init(dom);
    myChart.setOption(ops);
    chartArr.push(myChart);
  }

  function delayAni($el, t) { /* 延迟执行动画 $el=目标元素 t=延迟时间(单位：ms) */
    var n = 0;
    /* 遍历元素 */
    $el.each(function (idx, ele) {
      n += t;
      move(this).scale(1).delay(n).duration('.5s').end();
    });
  }
  /* fullpage */
  var full = $('#fullpage').fullpage({
    sectionSelector: '.page-item',
    navigation: true,
    navigationPosition: 'right',
    showActiveTooltip: true,
    navigationTooltips: ['Home', '关于我', '职业技能', '作品展示', '联系我', '底部'],
    controlArrowColor: 'rgba(0,0,0,.4)',
    /* paddingTop: 55, */
    resize: true,
    vertical: true,
    sectionsColor: ['', '', 'rgba(0,0,0,.2)', 'rgba(0,0,0,.2)'],
    anchors: ['p_home', 'p_aboutme', 'p_skills', 'p_show', 'p_contactme', 'p_footer'],
    scrollOverflow: true,
    css3: true,
    animateAnchor: true,
    normalScrollElements: '.menu-sidebar',
    /* responsiveWidth: 600, */
    afterRender: function () {
      /* 移除载入动画 */
      var $loadEle = $('#loading_animate');
      $loadEle.animateCss('removeLoadAni', function (el) {
        $(el).remove();
        get$Ele(0, '.page-title').css('opacity', 1).animateCss('zoomInUp');
        get$Ele(0, '.title-hr').animateCss('fadeInUp', function () {
          get$Ele(0, 'h4').animateCss('fadeInUp', function () {
            get$Ele(0, '.page-btn-block').animateCss('fadeInUp');
            get$Ele(0, '.page-two-btn').animateCss('fadeInDown');
          })
        })
      })
      createEchars('echars_html', opt('#fc7a26', 8, 'HTML', '130%'));
      createEchars('echars_css', opt('#4dc21f', 9, 'CSS', '130%'));
      createEchars('echars_js', opt('#1fc2b5', 7, 'Javascript', '130%'));
      createEchars('echars_ps', opt('#fcad26', 6, 'Photoshop', '130%'));
      createEchars('echars_tools', opt('#588ad3', 6, '其他工具', '130%'));
      window.onresize = function () {
        for (var i in chartArr) {
          chartArr[i].resize();
        }
        $.fn.fullpage.reBuild();
      }
    },
    afterLoad: function (i, pageNum) {
      var _idx = pageNum - 1,
        $tit = get$Ele(this, '.page-title'),
        /* 当页标题 */
        $con = get$Ele(this, '.page-content'),
        /* 当页内容块 */
        $panel = $con.find('.under-panel'),
        $mItem = $con.find('.masonry-item'),
        $pageTwoBtn = get$Ele(this, '.page-two-btn');
      /* Navbar在第一页的时候添加class(navtop) 其他页数移除class */
      pageNum === 1 ? $navbar.addClass('navtop') : $navbar.removeClass('navtop');


      switch (pageNum) {
        case 1:
          move($pageTwoBtn[0]).scale(1).end();
          break;
        case 3:
          $tit.addClass('page-title-ani');
          delayAni($panel, 100);
          break;
        case 4:
          delayAni($panel, 100);
          move($tit[0]).scale(1).end();
          break;
        case 5:
      }
    },
    onLeave: function (index, nextIndex, dire) {
      var _idx = index - 1,
        $tit = get$Ele(this, '.page-title'),
        $con = get$Ele(this, '.page-content'),
        $panel = $con.find('.under-panel'),
        $pageTwoBtn = get$Ele(this, '.page-two-btn');

      changeBg(nextIndex, dire); /* 改变背景图 */
      switch (index) {
        case 1:
          move($pageTwoBtn[0]).scale(0).end();
          break;
        case 2:
          break;
        case 3:
          $tit.removeClass('page-title-ani');
          $panel.animateCss('bounceOut', function (el) {
            $(el).css({
              'transform': 'scale(0)'
            });
          });
          break;
        case 4:
          if (dire != 'down') {
            $panel.animateCss('bounceOut', function (el) {
              $(el).css({
                'transform': 'scale(0)'
              });
            });
          }
      }

    }
  });
});