function getreplyList(a){if(void 0===typeof a||null===a||0===a.length)return'<ul class="reply-list"></ul>';for(var i="",s=0;s<a.length;s++){var t=a[s],e=t.floor,d=t.user.name,l=""!==t.user.avatar?t.user.avatar:"/images/my-head.png",c=t.submitAddress,r=t.createTime,o=t.to,n=t.repContent;i+='<li class="comment-item"><div><span>#'+e+'</span><div class="head-pic"><a href="javascript:void(0);"><img src="'+l+'" alt="avatar"></a></div><div class="content"><div class="info"><div class="lt"><div class="username">'+d+'</div><div class="address">'+c+'</div><div class="p-date">'+r+"</div></div></div>",i+=""==o?"<p>"+n+"</p>":"<p>回复 #"+o.floor+" "+o.author_id.user_name+":"+n+"</p>",i+='<div class="tools"><a href="javascript:void(0);" class="comm-reply-btn">回复</a></div></div></div><div class="reply-block"><div class="add-comm clearfix"><textarea name="comm_textarea" class="comm-textarea" cols="30" rows="10"></textarea><a href="javascript:void(0);" class="comm-submit-btn reply-child" data-repid='+t.id+'>提交</a></div><div class="close-btn"></div></div></li>'}return'<ul class="reply-list show">'+i+"</ul>"}$(function(){$(".comment-block").on("click",".comm-submit-btn",function(){if(c()&&!(0<$(this).children(".loading-ani").length)){var a,r,i,o,s,t,n=$(this),m=n.siblings(".comm-textarea"),e=$(".article-box").attr("data-artid"),d="/api/v1/article/comment/submitcomment",l={art_id:e,comm_content:m.val()},v=$(this).parent().parent();if(v.is($(".reply-block")))return n.hasClass("reply-child")?(o=n.parents(".reply-list").eq(0),s=o.parents(".comment-item").eq(0).attr("data-commid"),t=n.attr("data-repid"),d="/api/v1/article/comment/submitReply",l.commid=s,l.reply_id=t,void requestAjax({el:n,url:d,data:l},function(a){if(p(a,n)){var i=a.data,s=i.floor,t=i.username,e=i.submitAddress,d=i.create_time,l=i.to,c=i.art_content,r='<li class="comment-item"><div><span>#'+s+'</span><div class="head-pic"><a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a></div><div class="content"><div class="info"><div class="lt"><div class="username">'+t+'</div><div class="address">'+e+'</div><div class="p-date">'+d+"</div></div></div><p>回复 "+l+":"+c+"</p></div></div></li>";o.prepend(r),m.val(""),v.removeClass("show")}})):(a=n.parents(".comment-item").eq(0),r=a.find(".reply-list"),i=a.attr("data-commid"),d="/api/v1/article/comment/submitReply",l.commid=i,void requestAjax({el:n,url:d,data:l},function(a){if(p(a,n)){var i=a.data,s=i.floor,t=i.username,e=i.submitAddress,d=i.create_time,l=i.art_content;r.addClass("show");var c='<li class="comment-item"><div><span>#'+s+'</span><div class="head-pic"><a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a></div><div class="content"><div class="info"><div class="lt"><div class="username">'+t+'</div><div class="address">'+e+'</div><div class="p-date">'+d+"</div></div></div><p>"+l+"</p></div></div></li>";r.prepend(c),m.val(""),v.removeClass("show")}}));requestAjax({el:n,url:d,data:l},function(a){if(p(a,n)){var i=a.data,s=i.username,t=i.submitAddress,e=i.create_time,d=i.floor,l=i.art_content,c='<li class="comment-item"><div><div class="head-pic"><a href="javascript:void(0);"><img src="/images/my-head.png" alt=""></a></div><div class="content"><div class="info"><div class="lt"><div class="username">'+s+'</div><div class="address">'+t+'</div><div class="p-date">'+e+'</div></div><div class="floor-blk">'+d+"楼</div></div><p>"+l+"</p></div></div></li>",r=$(".comm-list .list");r.prepend(c),m.val("")}})}function p(a,i){var s=i;return!!a.status&&(-1==a.status?(s.removeClass("msg hide").addClass("msg"),s.attr("data-attr",a.msg),s.one("transitionend",function(){setTimeout(function(){s.addClass("hide"),s.one("transitionend",function(){s.attr("data-attr","").removeClass("msg hide")})},2e3)}),!1):-9!==a.status||!(window.location.href="/login"))}});var a=$(".comment-block"),i=a.find(".add-comm");i.clone(),i.find(".comm-textarea");function c(){var i=!0;return $.ajax({url:"/auth",type:"post",async:!1,success:function(a){a||(i=!1,window.location.href="/login")}}),i}a.on("keyup",".comm-textarea",function(){$(this).val()?$(this).siblings(".comm-submit-btn").addClass("show"):$(this).siblings(".comm-submit-btn").removeClass("show")}),a.on("click",".comm-reply-btn",function(){if(c()){var a=$(this).parents(".comment-item").eq(0),i=a.find(">.reply-block"),s=a.parents(".comment-block").find(".reply-block");s.removeClass("show"),s.find(".comm-textarea").trigger("keyup").val(""),i.addClass("show")}}),a.on("click",".reply-block",function(a){"close-btn"==a.target.className&&$(this).removeClass("show")});var o=!0;$(".comment-block").on("click",".more-comms-lk",function(){if(o){var c=$(this),r=$(this).parent(),a=$(".comment-block .list").children(".comment-item").length;if(!(0<$(this).find(".loading-ani").length)){var i=$(".article-box").attr("data-artid");requestAjax({el:$(this),url:"/api/v1/article/comment/getComments",type:"get",data:{skip:a,artid:i}},function(a){var i=a.data;if(1!==a.status)return a.status&&0===a.status||i&&0===i.length?(r.text("--THE END--"),void(o=!1)):void c.text(a.msg);for(var s=0;s<i.length;s++){var t=i[s],e=getreplyList(i[s].commReps),d=""!==t.user.avatar?t.user.avatar:"/images/my-head.png",l='<li class="comment-item" data-commid='+t.id+'><div ><div class="head-pic" ><a href = "##" ><img src = "'+d+'" alt = "" ></a></div><div class="content"><div class ="info"><div class = "lt"><div class = "username">'+t.user.name+'</div><div class = "address">'+t.submitAddress+'</div><div class = "p-date" >'+t.createTime+'</div></div><div class ="floor-blk">'+t.floor+"楼</div></div><p>"+t.text+'</p><div class ="tools"><a href ="##" class = "comm-reply-btn" > 回复 </a></div></div></div><div class="reply-block"><div class="add-comm clearfix"><textarea name="comm_textarea" class="comm-textarea" cols="30" rows="10"></textarea><a href="javascript:void(0);" class="comm-submit-btn">提交</a></div><div class="close-btn"></div></div>'+e+"</li>";$(".comment-block .list").children(".comment-more").before(l)}})}}}),$(".btn-article-like").on("click",function(){$this=$(this);var a=$(".article-box").attr("data-artid");requestAjax({el:$(this),url:"/api/v1/article/like",requestAnimate:!1,data:{arcid:a}},function(a){-9!==a.status?(a.data&&a.data.isLiked?$this.addClass("liked"):$this.removeClass("liked"),"number"==typeof a.msg&&$this.find(".like-number").text(a.msg||0),console.log(a)):window.location.href="/login"})})});