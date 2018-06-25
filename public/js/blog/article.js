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
        data: data
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
              '#' + reps[j].floor +
              '<div class="head-pic">' +
              '<a href="##">' +
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
              '<a href="##" class="comm-reply-btn">回复' + '</a>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="reply-block">' +
              '<div class="add-comm clearfix">' +
              '<textarea name="comm_textarea" class="comm_textarea" id="comm_textarea" cols="30" rows="10"></textarea>' +
              '<a href="##" class="comm-submit-btn reply-child" data-repid=' + reps[j].id + '>提交</a>' +
              '</div>' +
              '<div class="close-btn"></div>' +
              '</div>' +
              '</li>';
          }

        }
        context += '</ul>' +
          '<div class="reply-block">' +
          '<div class="add-comm clearfix">' +
          '<textarea name="comm_textarea" class="comm_textarea" id="comm_textarea" cols="30" rows="10"></textarea>' +
          '<a href="##" class="comm-submit-btn">提交</a>' +
          '</div>' +
          '<div class="close-btn"></div>' +
          '</div></li>';
        $('.comment-block .list').children('.comment-more').before(context);
      }
    })
  })
});