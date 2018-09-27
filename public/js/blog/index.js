$(function () {
  getHotList();
  getNewArtList();
  weatherFn();
});

function getHotList() {
  var $hotList = $('.hot-list');
  requestAjax({
    el: $hotList,
    url: '/blog/article/getTop',
    timeout: 'getHotList'
  }, function (result) {
    if (!result && !result.status) {
      return console.log('错误');
    }
    var data = result.data;
    var con = '';
    for (var i = 0; i < data.length; i++) {
      var theData = data[i];
      var imgsrc = theData.previewImage ? theData.previewImage : '/images/exp.png';
      con += '<div class="swiper-slide hot-list-item">' +
        '<a href="/blog/article/' + theData.artid + '" class="hot-lk">' +
        '<span class="lt">' +
        '<img src="' + imgsrc + '" alt="images">' +
        '</span>' +
        '<span class="rt p10">' +
        '<div class="art-tit">' + theData.title + '</div>' +
        '<div class="art-info">' +
        '<div class="read"><i class="iconfont bottom icon-read"></i>' + theData.read + '</div>' +
        '<div class="time">' + theData.timeCreate + '</div>' +
        '</div>' +
        '</span>' +
        '</a>' +
        '</div>';
    }
    $hotList.find('.swiper-wrapper').append(con);
    new Swiper('.hot-list', {
      autoplay: true,
      mousewheel: true,
      direction: 'vertical',
      slidesPerView: 3,
      spaceBetween: 10,
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        }
      }
    });
  });
}

function getNewArtList() {
  var $artList = $('.article-list>ul');
  requestAjax({
    el: $artList,
    url: '/blog/getArtList',
    type: 'get',
    timeoutFunc: 'getNewArtList'
  }, function (result) {
    if (!result.status) {
      return alert('服务器错误，请刷新重试');
    }
    var data = result.data;
    var html = '';
    for (var n = 0; n < data.length; n++) {
      var art = data[n];
      var artid = art.id,
        /* 文章id */
        artTitle = art.title,
        /* 文章名 */
        artimg = getPic(art.content),
        /* 文章首张图片 */
        artRead = art.read,
        /* 阅读数 */
        artAuthor_name = art.author.name,
        /* 作者 */
        source = art.source,
        typeName = art.type.name,
        /* html内容 */
        time_create = art.time_create; /* 发布时间 */
      html += '<li>' +
        '<a href="/blog/article/' + artid + '">' +
        '<div class="card">' +
        '<div class="card-header">' +
        '<div class="title">' +
        '<h4><span class="art-type-tips">' + typeName + '</span>' + artTitle + '</h4>' +
        '</div>' +
        '<div class="info-box">' +
        '<div class="item read-num">' +
        '<i class="iconfont bottom icon-read"></i>' +
        artRead +
        '</div>' +
        '<div class="item author"><i class="iconfont bottom icon-iresume"> </i>' +
        artAuthor_name +
        '</div>' +
        '<div class="item author"><i class="iconfont bottom icon-time"> </i>' +
        time_create +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="card-body">' +
        '<div class="pic-box">' + artimg +
        '</div>' +
        '<p>' + source +
        '</p>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '</li>';
    }
    $artList.append(html);
    /* 得到文章首张图片，如果没有 则用默认替代 */
    function getPic(str) {
      var imgReg = /<img.*?(?:>|\/>)/gi;
      var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      var arr = str.match(imgReg);
      if (arr != null) {
        var src = arr[0].match(srcReg);
        return src === null ?
          '<img src="/images/login_pic.png" alt="空白">' :
          '<img src=' + src[1] + ' alt="">';
      } else {
        return '<img src="/images/login_pic.png" alt="空白">';
      }
    }
  });
}

function weatherFn() {
  getGeolocation(function (geolo) {
    requestAjax({
      el: $('body'),
      url: '/blog/weather',
      type: 'get',
      data: {
        geolocation: geolo
      }
    }, function (result) {
      if (parseInt(result.status) !== 1) {
        return;
      }
      var weatherInfo = result.lives[0];
      $('#date').html(weatherInfo.reporttime);
      $('.temp .s-wd').html(weatherInfo.temperature);
      $('#summary').html(weatherInfo.city);
      console.log(result);
    })
  });


}
/* 获取定位 */
function getGeolocation(cb) {
  var geolocation = false;
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    //经度
    var longitude = crd.longitude;
    //纬度
    var latitude = crd.latitude;
    geolocation = longitude + ',' + latitude;
    return cb(geolocation);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }




}