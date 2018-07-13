$(function () {
  getHotList();
});

function getHotList() {
  var $hotList = $('.hot-list');
  requestAjax({
    el: $hotList,
    url: '/blog/article/getTop',
  }, function (result) {
    if (!result && !result.status) {
      return console.log('错误');
    }
    var data = result.data;
    var con = '';
    for (var i = 0; i < data.length; i++) {
      var theData = data[i];
      var imgsrc = theData.previewImage ? theData.previewImage : '/images/my-head.png';
      con += '<div class="swiper-slide hot-list-item">' +
        '<a href="/blog/article/' + theData.artid + '" class="hot-lk">' +
        '<span class="lt">' +
        '<img src="' + imgsrc + '" alt="">' +
        '</span>' +
        '<span class="rt">' +
        '<div class="art-tit">' + theData.title +
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
          slidesPerView: 2,
          spaceBetween: 30,
        }
      }
    });
  });
}