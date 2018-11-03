$(function () {
  $('.comment-block').on('click', '.comm-submit-btn', function () {
    if (!isLogin()) return;
    if ($(this).children('.loading-ani').length > 0) return;
    var $this = $(this),
      $comTextarea = $this.siblings('.comm-textarea'),
      artid = $('.article-box').attr('data-artid'),
      submitUrl = '/api/v1/article/comment/submitcomment',
      data = {
        art_id: artid,
        comm_content: $comTextarea.val()
      },
      $replyBlock = $(this).parent().parent();
    if ($replyBlock.is($('.reply-block'))) {
      if ($this.hasClass('reply-child')) {
        replyChild();
        return;
      }
      replyComment();
      return;
    }
    submitComment();

    function replyComment() {
      var $li = $this.parents('.comment-item').eq(0),
        $replyList = $li.find('.reply-list'),
        commid = $li.attr('data-commid');
      submitUrl = '/api/v1/article/comment/submitReply';
      data['commid'] = commid;
      requestAjax({
        el: $this,
        url: submitUrl,
        data: data
      }, function (result) {
        if (!resultFalse(result, $this)) return;
        var data = result.data,
          floor = data.floor,
          username = data.username,
          submitAddress = data.submitAddress,
          timeCreate = data.create_time,
          artContent = data.art_content;
        $replyList.addClass('show');
        var context =
          '<li class="comment-item">' +
          '<div>' +
          '<span>' +
          '#' + floor +
          '</span>' +
          '<div class="head-pic">' +
          '<a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a>' +
          '</div>' +
          '<div class="content">' +
          '<div class="info">' +
          '<div class="lt">' +
          '<div class="username">' + username + '</div>' +
          '<div class="address">' + submitAddress + '</div>' +
          '<div class="p-date">' + timeCreate + '</div>' +
          '</div>' +
          '</div>' +
          '<p>' + artContent + '</p>' +
          '</div>' +
          '</div>' +
          '</li>';
        $replyList.prepend(context);
        $comTextarea.val('');
        $replyBlock.removeClass('show');
      });


    }

    function replyChild() {
      var $ul = $this.parents('.reply-list').eq(0),
        commid = $ul.parents('.comment-item').eq(0).attr('data-commid'),
        replyTo = $this.attr('data-repid');
      submitUrl = '/api/v1/article/comment/submitReply';

      data['commid'] = commid;
      data['reply_id'] = replyTo;
      requestAjax({
        el: $this,
        url: submitUrl,
        data: data
      }, function (result) {
        if (!resultFalse(result, $this)) return;
        var data = result.data,
          floor = data.floor,
          username = data.username,
          submitAddress = data.submitAddress,
          timeCreate = data.create_time,
          to = data.to,
          artContent = data.art_content;
        var context =
          '<li class="comment-item">' +
          '<div>' +
          '<span>' +
          '#' + floor +
          '</span>' +
          '<div class="head-pic">' +
          '<a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a>' +
          '</div>' +
          '<div class="content">' +
          '<div class="info">' +
          '<div class="lt">' +
          '<div class="username">' + username + '</div>' +
          '<div class="address">' + submitAddress + '</div>' +
          '<div class="p-date">' + timeCreate + '</div>' +
          '</div>' +
          '</div>' +
          '<p>回复 ' + to + ':' + artContent + '</p>' +
          '</div>' +
          '</div>' +
          '</li>';
        $ul.prepend(context);
        $comTextarea.val('');
        $replyBlock.removeClass('show');
      })

    }

    function resultFalse(result, el) {
      var $el = el;
      if (!result.status) return false;
      if (result.status == -1) {
        $el.removeClass('msg hide').addClass('msg');
        $el.attr('data-attr', result.msg);
        $el.one('transitionend', function () {
          setTimeout(function () {
            $el.addClass('hide');
            $el.one('transitionend', function () {
              $el.attr('data-attr', '').removeClass('msg hide');
            })
          }, 2000);
        })
        return false;
      }
      if (result.status === -9) {
        window.location.href = '/login';
        return false;
      }
      return true;

    }
    /* 提交评论 */
    function submitComment() {
      requestAjax({
          el: $this,
          url: submitUrl,
          data: data
        },
        function (result) {
          if (!resultFalse(result, $this)) return;
          var data = result.data,
            username = data.username,
            submitAddress = data.submitAddress,
            timeCreate = data.create_time,
            floor = data.floor,
            artContent = data.art_content;
          var context =
            '<li class="comment-item">' +
            '<div>' +
            '<div class="head-pic">' +
            '<a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a>' +
            '</div>' +
            '<div class="content">' +
            '<div class="info">' +
            '<div class="lt">' +
            '<div class="username">' + username + '</div>' +
            '<div class="address">' + submitAddress + '</div>' +
            '<div class="p-date">' + timeCreate + '</div>' +
            '</div>' +
            '<div class="floor-blk">' + floor + '楼</div>' +
            '</div>' +
            '<p>' + artContent + '</p>' +
            '</div>' +
            '</div>' +
            '</li>';
          var $list = $('.comm-list .list');
          $list.prepend(context);
          $comTextarea.val('');
        });
    }
  })
  var $commBlock = $('.comment-block'),
    $addCommBox = $commBlock.find('.add-comm'),
    clone = $addCommBox.clone(),
    $inputBox = $addCommBox.find('.comm-textarea');
  /* 监听键盘抬起 显示隐藏回复框 */
  $commBlock.on('keyup', '.comm-textarea', function () {
    if ($(this).val()) {
      $(this).siblings('.comm-submit-btn').addClass('show');
    } else {
      $(this).siblings('.comm-submit-btn').removeClass('show');
    }
  })
  /* 判断用户登录状态 */
  function isLogin() {
    var Flag = true;
    $.ajax({
      url: '/auth',
      type: 'post',
      async: false,
      success: function (result) {
        if (!result) {
          Flag = false;
          window.location.href = '/login';
        }
      }
    });
    return Flag;
  }
  /* 回复按钮单击事件 */
  $commBlock.on('click', '.comm-reply-btn', function () {
    if (!isLogin()) return;
    var $li = $(this).parents(".comment-item").eq(0),
      $replyBlock = $li.find('>.reply-block'),
      $sibReplyBlock = $li.parents('.comment-block').find('.reply-block');
    $sibReplyBlock.removeClass('show');
    $sibReplyBlock.find('.comm-textarea').trigger('keyup').val('');
    $replyBlock.addClass('show');

  });
  $commBlock.on('click', '.reply-block', function (e) {
    if (e.target.className == 'close-btn') {
      $(this).removeClass('show');
    }
  });
  var HasMore = true;
  $('.comment-block').on('click', '.more-comms-lk', function () {
    if (!HasMore) return;
    var $this = $(this);
    var $par = $(this).parent();
    var commLen = $('.comment-block .list').children('.comment-item').length;
    if ($(this).find('.loading-ani').length > 0) return;
    var artid = $('.article-box').attr('data-artid');
    requestAjax({
      el: $(this),
      url: '/api/v1/article/comment/getComments',
      type: 'get',
      data: {
        'skip': commLen,
        'artid': artid
      }
    }, function (result) {

      var artComms = result.data;

      if (result.status !== 1) {

        if ((result.status && result.status === 0) || (artComms && artComms.length === 0)) {
          $par.text('--THE END--');
          HasMore = false;
          return;
        }
        $this.text(result.msg);
        return;
      }
      for (var i = 0; i < artComms.length; i++) {
        var comms = artComms[i],
          repsList = getreplyList(artComms[i].commReps);
        var avatar = comms.user.avatar !== '' ? comms.user.avatar : '/images/my-head.png';
        var context =
          '<li class="comment-item" data-commid=' + comms.id + '>' +
          '<div >' +
          '<div class="head-pic" >' +
          '<a href = "##" >' +
          '<img src = "' + avatar + '" alt = "" >' +
          '</a>' +
          '</div>' +
          '<div class="content">' +
          '<div class ="info">' +
          '<div class = "lt">' +
          '<div class = "username">' + comms.user.name + '</div>' +
          '<div class = "address">' + comms.submitAddress + '</div>' +
          '<div class = "p-date" >' + comms.createTime + '</div>' +
          '</div>' +
          '<div class ="floor-blk">' + comms.floor + "楼" + '</div>' +
          '</div>' +
          '<p>' + comms.text + '</p>' +
          '<div class ="tools">' +
          '<a href ="##" class = "comm-reply-btn" > 回复 </a>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="reply-block">' +
          '<div class="add-comm clearfix">' +
          '<textarea name="comm_textarea" class="comm-textarea" cols="30" rows="10"></textarea>' +
          '<a href="javascript:void(0);" class="comm-submit-btn">提交</a>' +
          '</div>' +
          '<div class="close-btn"></div>' +
          '</div>' + repsList +
          '</li>';
        $('.comment-block .list').children('.comment-more').before(context);
      }
    })
  })

  $('.btn-article-like').on('click', function () {
    $this = $(this);
    var arcid = $('.article-box').attr('data-artid');
    requestAjax({
      el: $(this),
      url: '/api/v1/article/like',
      requestAnimate: false,
      data: {
        arcid: arcid
      }
    }, function (result) {
      if (result.status === -9) {
        window.location.href = '/login';
        return;
      }
      if (result.data && result.data.isLiked) {
        $this.addClass('liked');
      } else {
        $this.removeClass('liked');
      }
      typeof result.msg === 'number' ? $this.find('.like-number').text(result.msg || 0) : '';
      console.log(result);
    })
  })
});
/* 得到回复列表 */
function getreplyList(reps) {
  if (typeof reps === undefined || reps === null || reps.length === 0) {
    return '<ul class="reply-list"></ul>';
  }
  var repCon = '';
  for (var j = 0; j < reps.length; j++) {
    var rep = reps[j],
      floor = rep.floor,
      username = rep.user.name,
      avatar = rep.user.avatar !== '' ? rep.user.avatar : '/images/my-head.png',
      subAddress = rep.submitAddress,
      timeCreate = rep.createTime,
      to = rep.to,
      repContent = rep.repContent;
    repCon += '<li class="comment-item">' +
      '<div>' +
      '<span>' +
      '#' + floor +
      '</span>' +
      '<div class="head-pic">' +
      '<a href="javascript:void(0);">' +
      '<img src="' + avatar + '" alt="avatar">' +
      '</a>' +
      '</div>' +
      '<div class="content">' +
      '<div class="info">' +
      '<div class="lt">' +
      '<div class="username">' +
      username +
      '</div>' +
      '<div class="address">' +
      subAddress +
      '</div>' +
      '<div class="p-date">' +
      timeCreate +
      '</div>' +
      '</div>' +
      '</div>';
    if (to == '') {
      repCon += '<p>' + repContent + '</p>';
    } else {
      repCon += '<p>' + '回复 #' + to.floor + " " + to.author_id.user_name + ':' + repContent + '</p>';
    }
    repCon += '<div class="tools">' +
      '<a href="javascript:void(0);" class="comm-reply-btn">回复' + '</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="reply-block">' +
      '<div class="add-comm clearfix">' +
      '<textarea name="comm_textarea" class="comm-textarea" cols="30" rows="10"></textarea>' +
      '<a href="javascript:void(0);" class="comm-submit-btn reply-child" data-repid=' + rep.id + '>提交</a>' +
      '</div>' +
      '<div class="close-btn"></div>' +
      '</div>' +
      '</li>';
  }
  return '<ul class="reply-list show">' + repCon + '</ul>';
}