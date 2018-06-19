$(function () {
  $('.comment-block').on('click', '.comm-submit-btn', function () {
    if ($(this).children('.loading-ani').length > 0) return;
    var $this = $(this),
      $comTextarea = $this.siblings('.comm_textarea'),
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
        if (!result.status) return;
        var data = result.data;
        $replyList.addClass('show');
        var context =
          '<li class="comment-item">' +
          '<div>' +
          '#' + data.floor +
          '<div class="head-pic">' +
          '<a href="##"><img src="/images/jl.jpg" alt=""></a>' +
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
        data,
        data
      }, function (result) {
        if (!result.status) return;
        var data = result.data;
        var context =
          '<li class="comment-item">' +
          '<div>' +
          '#' + data.floor +
          '<div class="head-pic">' +
          '<a href="##"><img src="/images/jl.jpg" alt=""></a>' +
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
    /* 提交评论 */
    function submitComment() {
      requestAjax({
          el: $this,
          url: submitUrl,
          data: data
        },
        function (result) {
          if (!result.status) return;
          var data = result.data;
          var context =
            '<li class="comment-item">' +
            '<div>' +
            '<div class="head-pic">' +
            '<a href="##"><img src="/images/jl.jpg" alt=""></a>' +
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
    $inputBox = $addCommBox.find('.comm_textarea');
  /* 监听键盘抬起 显示隐藏回复框 */
  $commBlock.on('keyup', '.comm_textarea', function () {
    if ($(this).val()) {
      $(this).siblings('.comm-submit-btn').addClass('show');
    } else {
      $(this).siblings('.comm-submit-btn').removeClass('show');
    }
  })
  $replyBtn = $('.comm-reply-btn');
  /* 回复按钮单击事件 */
  $replyBtn.on('click', function () {
    var $li = $(this).parents(".comment-item").eq(0),
      $replyBlock = $li.find('>.reply-block'),
      $sibReplyBlock = $li.parents('.comment-block').find('.reply-block');
    $sibReplyBlock.removeClass('show');
    $sibReplyBlock.find('.comm_textarea').trigger('keyup').val('');
    $replyBlock.addClass('show');
  });
  $('.reply-block').on('click', function (e) {
    if (e.target.className == 'close-btn') {
      $(this).removeClass('show');
    }

  });

  $('.comment-block').on('click', '.more-comms-lk', function () {
    var commLen = $('.comment-item').index();
    requestAjax({
      el: $(this),
      url: '/blog/getComments',
      data: {
        'skip': commLen
      }
    }, function (result) {
      console.log(result);
    })
  })
});