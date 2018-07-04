$(function () {
  var cropper;
  (function () {
    var $el = $('.tab'),
      $head = $el.find('.tab-head'),
      $body = $el.find('.tab-body'),
      $headItem = $head.find('.tab-head-item'),
      $bodyItem = $body.find('.tab-body-item');
    $headItem.eq(0).addClass('active');
    $bodyItem.eq(0).addClass('show');
    $headItem.on('click', function () {
      if ($headItem.length != $bodyItem.length) return console.log('!=');
      var $this = $(this);
      var idx = $this.index();
      $this.addClass('active').siblings().removeClass('active');
      var targetBody = $bodyItem.eq(idx);
      targetBody.addClass('show').siblings().removeClass('show');

    })
  })();
  (function () {
    var $image = $('#img_avatar');
    var $input = $('.select-img');
    var $uploadBtn = $('.submit-btn');
    var $modal = $('.modal-box'),
      $mCloseBtn = $modal.find('.close-btn'),
      $headBtn = $('.top-box .head-box');
    $headBtn.on('click', function () {
      if ($modal.hasClass('show')) return false;
      $modal.addClass('show');
    })

    $mCloseBtn.on('click', function () {

      $('.modal-box').removeClass('show');
    })
    $input.on('change', function () {
      var $this = $(this);
      var objUrl = getObjectURL(this.files[0])
      if (objUrl) {
        $image.attr('src', objUrl);
        $image.cropper({
          aspectRatio: 1 / 1,
          preview: ".small-preview,.small-preview2",
          crop: function (event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
          }
        });

        // Get the Cropper.js instance after initialized
        cropper = $image.data('cropper');
      }

    });
    $uploadBtn.on('click', function () {
      var $this = $(this);
      var imgBase = cropper.getCroppedCanvas().toDataURL('image/jpeg');
      var data = {
        imgBase: imgBase
      };
      requestAjax({
        el: $this,
        url: '/blog/user/uploadAvatar',
        data: data
      }, function (result) {
        if (!result.status) {
          $this.text('错误');
          return false;
        }
        $mCloseBtn.trigger('click');
        $headBtn.find('img').attr('src', result.data.src);
        $input.val('');
        cropper.clear();
      });
    });
  })();
  (function () {

  })();
});

function getObjectURL(file) {
  var url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}