function hotArcFn(){var n=$(".hot-list");requestAjax({el:n,url:"/api/v1/article/gettop",timeout:"hotArcFn",type:"get"},function(t){if(!t&&!t.status)return console.log("错误");!function(t){for(var e="",i=0;i<t.length;i++){var a=t[i],r=a.previewImage?a.previewImage:"/images/exp.png";e+='<div class="swiper-slide hot-list-item"><a href="/blog/article/'+a.artid+'" class="hot-lk"><span class="lt"><img src="'+r+'" alt="images" onerror="this.src=\'/images/exp.png\'"></span><span class="rt p10"><div class="art-tit">'+a.title+'</div><div class="art-info"><div class="read"><i class="iconfont bottom icon-eye"></i>'+a.read+'</div><div class="time">'+a.timeCreate+"</div></div></span></a></div>"}n.find(".swiper-wrapper").append(e),new Swiper(".hot-list",{autoplay:!0,mousewheel:!0,direction:"vertical",slidesPerView:3,spaceBetween:10,scrollbar:{el:".swiper-scrollbar"},breakpoints:{768:{slidesPerView:3,spaceBetween:10}}})}(t.data)})}function newArcFn(){var d=$(".article-list ul");function u(t){var e=t.match(/<img.*?(?:>|\/>)/gi);if(null==e)return'<img src="/images/login_pic.png" alt="空白">';var i=e[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);return null===i?'<img src="/images/login_pic.png" alt="空白">':"<img src="+i[1]+' alt="" onerror="this.src=\'/images/logo.png\'">'}requestAjax({el:d,url:"/blog/getArtList",type:"get",timeoutFunc:"newArcFn"},function(t){if(!t.status)return alert("服务器错误，请刷新重试");!function(t){for(var e="",i=0;i<t.length;i++){var a=t[i],r=a.id,n=a.title,o=u(a.content),s=a.read,c=a.author.name,l=a.source;e+='<li><a href="/blog/article/'+r+'"><div class="card"><div class="card-header"><div class="title"><h4><span class="art-type-tips">'+a.type.name+"</span>"+n+'</h4></div><div class="info-box"><div class="item read-num"><i class="iconfont bottom icon-eye"></i>'+s+'</div><div class="item author"><i class="iconfont bottom icon-icon_writer"> </i>'+c+'</div><div class="item author"><i class="iconfont bottom icon-time"> </i>'+a.time_create+'</div></div></div><div class="card-body"><div class="pic-box">'+o+"</div><p>"+l+"</p></div></div></a></li>"}d.append(e)}(t.data.arcList)})}function weatherFn(){$(".weather").on("click",function(){$(this).hasClass("show-more")?($(this).removeClass("show-more"),$("body").css("overflow","auto")):($("body").css("overflow","hidden"),$(this).addClass("show-more"))}),getGeolocation(function(t,e){var i;i=e,requestAjax({el:$("body"),url:"/api/v1/weather/gettheday",type:"get",data:{geolocation:i}},function(t){var e,i,a,r;1===parseInt(t.status)&&(i=(e=t.lives[0]).weather,a=$(".weather"),r=function(t){var e={"sun-shower":["小雨转晴","太阳雨"],"thunder-storm":["雷雨","雷阵雨"],cloudy:["多云","阴"],flurries:["雪","小雪","中雪","大雪","阵雪"],sunny:["晴","晴天"],rainy:["雨","小雨","中雨","阵雨","大雨"]};for(var i in e)if(e.hasOwnProperty(i))for(var a=e[i],r=0;r<a.length;r++)if(a[r]===t)return i}(i),$("."+r).addClass("show"),a.find(".w-up-time").html(e.reporttime),a.find(".w-city").html(e.city),a.find(".w-temp").html(e.temperature),a.find(".w-province").html(e.province))})})}function getGeolocation(r){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(t){var e=t.coords,i=e.longitude,a=e.latitude;return r(null,i+","+a)},function(t){return r(t,null)},{enableHighAccuracy:!0,timeout:2e4,maximumAge:0})}$(function(){hotArcFn(),newArcFn(),weatherFn()});