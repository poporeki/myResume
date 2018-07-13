$(function () {
  /*正则 规则 */
  var regs = {
    name: /^[\D]{1}([\u4e00-\u9fa5\-\w]){3,11}$/, //用户名规则
    pwd: /^\S{6,20}$/, //密码规则
    tel: /^1[3-9]\d{9}$/ //手机号码规则
  }
  var $captcha = $('.captcha-img'),
    $list = $('.form-list'),
    $suBox = $('.su-box');
  $captcha.on('click', function () {
    requestAjax({
      el: $captcha,
      url: "verify/refreshCaptcha"
    }, function (result) {
      if (!result && !result.data) return;
      $captcha.attr('src', result.data);
    });
  });
  $list.on('keyup', function (e) {
    var $this = $(this);
    var $target = $(e.target);
    var $par = $target.parent();
    var val = $target.val();
    var tarStatus = parseInt($target.attr('data-status'));
    var $tips = $target.siblings('.tips-box');
    if (val == '') {
      tarStatus = 0;
      $target.attr('data-status', 0);
      $tips.removeClass('canuse error noerr show').addClass('show error').text('内容不能为空');
      return;
    } else {
      tarStatus = 1;
      $target.attr('data-status', 1);
      $tips.removeClass('canuse error noerr show').text('');
    }


    if ($target.hasClass('username')) {
      var REG = regs.name;
      var isTrue = REG.test(val);
      if (!isTrue) {
        $tips.removeClass('canuse error noerr show').addClass('show error').text('请输入正确的账号');
      }
      if (isTrue && tarStatus) {
        requestAjax({
          el: $par,
          url: "/verify/checkUserName",
          data: {
            username: val
          }
        }, function (result) {
          if (!result) {
            $tips.removeClass('canuse error noerr show').addClass('show error').text('已被占用');
          } else {
            $tips.removeClass('canuse error noerr show').addClass('show canuse').text('可以注册');
          }
        })
      }
    }

    if ($target.hasClass('password')) {
      var REG = regs.pwd;
      var isTrue = REG.test(val);
      if (!isTrue) {
        $tips.removeClass('canuse error noerr show').addClass('show error').text('请输入合适的密码');
        $target.attr('data-status', 0);
        return;
      }
      $target.attr('data-status', 1);
    }
    if ($target.hasClass('check-password')) {
      var $password = $('#password');
      var $confirmPwd = $target;
      if ($password.val() != $confirmPwd.val()) {
        $target.attr('data-status', 0);
        $tips.removeClass('canuse error noerr show').addClass('show error').text('密码不一致，请重新输入');
        return;
      }
      $target.attr('data-status', 1);
    }
    if ($target.hasClass('captcha')) {
      requestAjax({
        el: $par,
        url: "/verify/checkCaptcha",
        data: {
          str: val
        }
      }, function (result) {
        if (!result) {
          $target.attr('data-status', 0);
          $tips.removeClass('canuse error noerr show').addClass('show error').text('false');
        } else {
          $target.attr('data-status', 1);
          $tips.removeClass('canuse error noerr show').addClass('show canuse').text('ok!');
        }
      });
    }
  });
  $('.su-submit-btn').on('click', function () {
    var $this = $(this);
    var $input = $suBox.find('input');
    $input.trigger('keyup');
    var FLAG = true;
    $input.each(function () {
      if (!FLAG) return;
      var $this = $(this);
      if (parseInt($this.attr('data-status')) === 0) {
        return FLAG = false;
      }
    })
    if (!FLAG) {
      return alert('有错误信息,请检查');
    }
    var data = $suBox.serializeArray();
    requestAjax({
      el: $this,
      url: '/reg',
      data: data
    }, function (result) {
      if (!result.status) {
        return alert(result.msg != '' ? result.msg : '失敗');

      }
      var $boxTip = $suBox.find('.su-tips');
      var num = $boxTip.find('span small');
      $boxTip.addClass('show');
      (function aa(n) {
        if (n <= 0) {
          document.referrer = '';
          return window.location.href = '/login';
        }
        setTimeout(function () {
          n--;
          num.text(n);
          aa(n);
        }, 1000);
      })(5);
    })
  });
});