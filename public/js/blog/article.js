$(function () {
  $('.comment-block').on('click', '.comm-submit-btn', function () {
    if (!isLogin()) return;
    if ($(this).children('.loading-ani').length > 0) return;
    var $this = $(this),
      $comTextarea = $this.siblings('.comm-textarea'),
      artid = $('.article-box').attr('data-artid'),
      submitUrl = '/blog/article/postComment',
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
      submitUrl = '/blog/article/submitReply';
      data['commid'] = commid;
      requestAjax({
        el: $this,
        url: submitUrl,
        data: data
      }, function (result) {
        if (!resultFalse(result, $this)) return;
        var data = result.data;
        $replyList.addClass('show');
        var context =
          '<li class="comment-item">' +
          '<div>' +
          '<span>' +
          '#' + data.floor +
          '</span>' +
          '<div class="head-pic">' +
          '<a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a>' +
          '</div>' +
          '<div class="content">' +
          '<div class="info">' +
          '<div class="lt">' +
          '<div class="username">' + data.username + '</div>' +
          '<div class="address">' + data.submitAddress + '</div>' +
          '<div class="p-date">' + data.create_time + '</div>' +
          '</div>' +
          '</div>' +
          '<p>' + data.art_content + '</p>' +
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
      submitUrl = '/blog/article/submitReply';

      data['commid'] = commid;
      data['reply_id'] = replyTo;
      requestAjax({
        el: $this,
        url: submitUrl,
        data: data
      }, function (result) {
        if (!resultFalse(result, $this)) return;
        var data = result.data;
        var context =
          '<li class="comment-item">' +
          '<div>' +
          '<span>' +
          '#' + data.floor +
          '</span>' +
          '<div class="head-pic">' +
          '<a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a>' +
          '</div>' +
          '<div class="content">' +
          '<div class="info">' +
          '<div class="lt">' +
          '<div class="username">' + data.username + '</div>' +
          '<div class="address">' + data.submitAddress + '</div>' +
          '<div class="p-date">' + data.create_time + '</div>' +
          '</div>' +
          '</div>' +
          '<p>回复 ' + data.to + ':' + data.art_content + '</p>' +
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
      } else {
        return true;
      }
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
          var data = result.data;
          var context =
            '<li class="comment-item">' +
            '<div>' +
            '<div class="head-pic">' +
            '<a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a>' +
            '</div>' +
            '<div class="content">' +
            '<div class="info">' +
            '<div class="lt">' +
            '<div class="username">' + data.username + '</div>' +
            '<div class="address">' + data.submitAddress + '</div>' +
            '<div class="p-date">' + data.create_time + '</div>' +
            '</div>' +
            '<div class="floor-blk">' + data.floor + '楼</div>' +
            '</div>' +
            '<p>' + data.art_content + '</p>' +
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
    var $par = $(this).parent();
    var commLen = $('.comment-block .list').children('.comment-item').length;
    if ($(this).find('.loading-ani').length > 0) return;
    var artid = $('.article-box').attr('data-artid');
    requestAjax({
      el: $(this),
      url: '/blog/getComments',
      data: {
        'skip': commLen,
        'artid': artid
      }
    }, function (result) {
      if (!result.status) {

        return;
      }
      var artComms = result.data;
      if (artComms.length === 0) {
        $par.text('--THE END--');
        HasMore = false;
        return;
      }
      for (var i = 0; i < artComms.length; i++) {
        var reps = artComms[i].commReps;
        var context =
          '<li class="comment-item" data-commid=' + artComms[i].id + '>' +
          '<div >' +
          '<div class="head-pic" >' +
          '<a href = "##" >' +
          '<img src = "/images/my-head.png" alt = "" >' +
          '</a>' +
          '</div>' +
          '<div class="content">' +
          '<div class ="info">' +
          '<div class = "lt">' +
          '<div class = "username">' + artComms[i].user.name + '</div>' +
          '<div class = "address">' + artComms[i].submitAddress + '</div>' +
          '<div class = "p-date" >' + artComms[i].createTime + '</div>' +
          '</div>' +
          '<div class ="floor-blk">' + artComms[i].floor + "楼" + '</div>' +
          '</div>' +
          '<p>' + artComms[i].text + '</p>' +
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
          '</div>';
        if (typeof artComms[i].commReps != 'undefined' && artComms[i].commReps.length != 0) {
          context += '<ul class="reply-list show">'
        } else {
          context += '<ul class="reply-list">'
        }
        if (typeof (artComms[i].commReps) != 'undefined' && artComms[i].commReps.length != 0) {
          var reps = artComms[i].commReps;
          for (var j = 0; j < reps.length; j++) {
            context += '<li class="comment-item">' +
              '<div>' +
              '<span>' +
              '#' + reps[j].floor +
              '</span>' +
              '<div class="head-pic">' +
              '<a href="javascript:void(0);">' +
              '<img src="/images/my-head.png" alt="">' +
              '</a>' +
              '</div>' +
              '<div class="content">' +
              '<div class="info">' +
              '<div class="lt">' +
              '<div class="username">' +
              reps[j].user.name +
              '</div>' +
              '<div class="address">' +
              reps[j].submitAddress +
              '</div>' +
              '<div class="p-date">' +
              reps[j].createTime +
              '</div>' +
              '</div>' +
              '</div>';
            if (reps[j].to == '') {
              context += '<p>' + reps[j].repContent + '</p>';
            } else {
              context += '<p>' + '回复 #' + reps[j].to.floor + " " + reps[j].to.author_id.user_name + ':' + reps[j].repContent + '</p>';
            }
            context += '<div class="tools">' +
              '<a href="javascript:void(0);" class="comm-reply-btn">回复' + '</a>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="reply-block">' +
              '<div class="add-comm clearfix">' +
              '<textarea name="comm_textarea" class="comm-textarea" cols="30" rows="10"></textarea>' +
              '<a href="javascript:void(0);" class="comm-submit-btn reply-child" data-repid=' + reps[j].id + '>提交</a>' +
              '</div>' +
              '<div class="close-btn"></div>' +
              '</div>' +
              '</li>';
          }

        }
        context += '</ul>' +
          '</li>';
        $('.comment-block .list').children('.comment-more').before(context);
      }
    })
  })
});