function formatSearch(i){if(void 0!==i){var t=(i=i.substr(1)).split("&"),r={},s=[],o=/([^\)]*)\[([^\)]*)\]/;return $.each(t,function(i,t){if(s=t.split("="),void 0===r[s[0]]){var a=s[0],e=o.exec(a);if(e){void 0===r.by&&(r.by={});var l=e[2];return void(r.by[l]=s[1])}r[s[0]]=s[1]}}),r}}$(function(){var s=$(".article-list"),i=1,o=!1,t=formatSearch(window.location.search);$(window).on("scroll",function(){s.offset().top+s.outerHeight()-$(window).scrollTop()<$(window).height()&&!1===o&&(o=!0,i+=1,t.page=i,t.num=10,requestAjax({el:s,url:"/api/v1/articlelist/getlist",type:"get",contentType:"application/json;charset=utf-8",data:t,aniEle:"loading-ani-articlelist"},function(i){if(o=!1,1===i.status){for(var t="",a=i.data.arclist,e=0;e<a.length;e++){var l=a[e],r=l.title;t+='<li class="article-list-item"><a href="/blog/article/'+l.artid+'"><div class="lt"><div class="top"><div class="title"><h4>'+r+'</h4></div><div class="time">'+l.create_time+'</div></div><div class="thumbnail">'+l.source+"</div></div></a></li>"}s.append(t)}else o=!0,s.append('<li  style="text-align:center;"><a href="javascript:void(0);">--THE END--</a></li>')}))})});