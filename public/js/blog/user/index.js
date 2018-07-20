$(function () {
  var cropper;
  /* tab选项卡 */
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
  /* 剪裁头像 */
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
          preview: ".small-preview,.small-preview2"
        });

        // Get the Cropper.js instance after initialized
        cropper = $image.data('cropper');
      }

    });
    /* 提交头像 */
    $uploadBtn.on('click', function () {
      var $this = $(this);
      if ($this.find('.loading-ani').length != 0) return;
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
    var $btnSubPwd = $('#submit_pwd');
    $btnSubPwd.on('click', function () {
      var $this = $(this);
      if ($this.find('.loading-ani').length != 0) return;
      var pwd = $('#pwd').val();
      var new_pwd = $('#new_pwd').val();
      if (pwd == '' || new_pwd == '') return alert('不能为空');
      requestAjax({
        el: $this,
        url: '/blog/user/changeUserPassword',
        data: {
          password: pwd,
          new_password: new_pwd
        }
      }, function (result) {
        if (result.status) {
          alert('修改成功');
          $('#pwd').val('');
          $('#new_pwd').val('');
        } else {
          alert('修改失败');
        }
      })
    })
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