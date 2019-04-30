$(function () {
  hotArcFn();
  newArcFn();
  weatherFn();

});

function isMobile() {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)))
    return true;
  else
    return false;
}
/* 获取阅读数最多的文章列表 */
function hotArcFn() {
  var $hotList = $('.hot-list');
  requestAjax({
    el: $hotList,
    url: '/api/v1/article/gettop',
    timeout: 'hotArcFn',
    type: 'get'
  }, function (result) {
    if (!result && !result.status) {
      return console.log('错误');
    }
    var data = result.data;
    updateDom(data);
  });

  function updateDom(data) {
    var con = '';
    for (var i = 0; i < data.length; i++) {
      var theData = data[i];
      var imgsrc = theData.previewImage ? theData.previewImage : '/images/exp.png';
      con += '<div class="swiper-slide hot-list-item">' +
        '<a href="/blog/article/' + theData.artid + '" class="hot-lk">' +
        '<span class="lt">' +
        '<img src="' + imgsrc + '" alt="images" onerror="this.src=\'/images/exp.png\'">' +
        '</span>' +
        '<span class="rt p10">' +
        '<div class="art-tit">' + theData.title + '</div>' +
        '<div class="art-info">' +
        '<div class="read"><i class="iconfont bottom icon-eye"></i>' + theData.read + '</div>' +
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
  }
}
/* 获取最新文章列表 */
function newArcFn() {
  var $artList = $('.article-list ul');
  requestAjax({
    el: $artList,
    url: '/blog/getArtList',
    type: 'get',
    timeoutFunc: 'newArcFn'
  }, function (result) {
    if (!result.status) {
      return alert('服务器错误，请刷新重试');
    }
    var arcList = result.data.arcList;
    updateDom(arcList);
  });
  /* 更新dom */
  function updateDom(arcList) {
    var html = '';
    for (var n = 0; n < arcList.length; n++) {
      var art = arcList[n];
      var artid = art.id,
        /* 文章id */
        artTitle = art.title,
        /* 文章名 */
        artimg = getImgSrc(art.content),
        /* 文章首张图片 */
        artRead = art.read,
        /* 阅读数 */
        artAuthor_name = art.author.name,
        /* 作者 */
        content = art.content,
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
        '<i class="iconfont bottom icon-eye"></i>' +
        artRead +
        '</div>' +
        '<div class="item author"><i class="iconfont bottom icon-icon_writer"> </i>' +
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
        '<p>' + content +
        '</p>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '</li>';
    }
    $artList.append(html);
  }
  /* 得到文章首张图片，如果没有 则用默认替代 */
  function getImgSrc(str) {
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = str.match(imgReg);
    var errorImg = '/images/logo.png';
    if (arr != null) {
      var src = arr[0].match(srcReg);
      return src === null ?
        '<img src="/images/login_pic.png" alt="空白">' :
        '<img src=' + src[1] + ' alt="" onerror="this.src=\'' + errorImg + '\'">';
    } else {
      return '<img src="/images/login_pic.png" alt="空白">';
    }
  }
}
/* 获取天气 */
function weatherFn() {
  $('.weather').on('click', function () {
    if ($(this).hasClass('show-more')) {
      $(this).removeClass('show-more')
      $('body').css('overflow', 'auto')
    } else {
      $('body').css('overflow', 'hidden')
      $(this).addClass('show-more')
    }

  })
  /* 取得类名 */
  function getWeatherClassName(weather) {
    var wObj = {
      'sun-shower': ['小雨转晴', '太阳雨'],
      'thunder-storm': ['雷雨', '雷阵雨'],
      'cloudy': ['多云', '阴'],
      'flurries': ['雪', '小雪', '中雪', '大雪', '阵雪'],
      'sunny': ['晴', '晴天'],
      'rainy': ['雨', '小雨', '中雨', '阵雨', '大雨']
    }

    for (var key in wObj) {
      if (wObj.hasOwnProperty(key)) {
        var element = wObj[key];
        for (var i = 0; i < element.length; i++) {
          if (element[i] === weather) {
            return key;
          }
        }
      }
    }
  }
  /* 更新dom */
  function updateDom(weatherInfo) {
    var weather = weatherInfo.weather;
    var $w_block = $('.weather');
    var className = getWeatherClassName(weather);
    $('.' + className).addClass('show');
    $w_block.find('.w-up-time').html(weatherInfo.reporttime);
    $w_block.find('.w-city').html(weatherInfo.city);
    $w_block.find('.w-temp').html(weatherInfo.temperature);
    $w_block.find('.w-province').html(weatherInfo.province);
  }
  /* 获取天气数据 */
  function updateWeather(geolo) {
    requestAjax({
      el: $('body'),
      url: '/api/v1/weather/gettheday',
      type: 'get',
      data: {
        geolocation: geolo
      }
    }, function (result) {
      if (parseInt(result.status) !== 1) return;
      updateDom(result.lives[0]);
    })
  }
  /* 获取地理位置信息 */
  if (!isMobile()) {
    updateWeather(null);
  } else {
    getGeolocation(function (err, geolo) {
      updateWeather(geolo);
    });
  }



}
/* 获取定位 */
function getGeolocation(cb) {
  var geolocation = false;
  var options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    //经度
    var longitude = crd.longitude;
    //纬度
    var latitude = crd.latitude;
    geolocation = longitude + ',' + latitude;
    return cb(null, geolocation);
  }

  function error(err) {
    return cb(err, null);
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
}

function getCarouselData() {

}