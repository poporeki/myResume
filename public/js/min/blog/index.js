function isMobile(){return!!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)}function hotArcFn(){var r=$(".hot-list");requestAjax({el:r,url:"/api/v1/article/gettop",timeout:"hotArcFn",type:"get"},function(e){if(!e&&!e.status)return console.log("错误");!function(e){for(var i="",t=0;t<e.length;t++){var a=e[t],n=a.previewImage?a.previewImage:"/images/exp.png";i+='<div class="swiper-slide hot-list-item"><a href="/blog/article/'+a.artid+'" class="hot-lk"><span class="lt"><img src="'+n+'" alt="images" onerror="this.src=\'/images/exp.png\'"></span><span class="rt p10"><div class="art-tit">'+a.title+'</div><div class="art-info"><div class="read"><i class="iconfont bottom icon-eye"></i>'+a.read+'</div><div class="time">'+a.timeCreate+"</div></div></span></a></div>"}r.find(".swiper-wrapper").append(i),new Swiper(".hot-list",{autoplay:!0,mousewheel:!0,direction:"vertical",slidesPerView:3,spaceBetween:10,scrollbar:{el:".swiper-scrollbar"},breakpoints:{768:{slidesPerView:3,spaceBetween:10}}})}(e.data)})}function newArcFn(){var p=$(".article-list ul");function v(e){var i=e.match(/<img.*?(?:>|\/>)/gi);if(null==i)return'<img src="/images/login_pic.png" alt="空白">';var t=i[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);return null===t?'<img src="/images/login_pic.png" alt="空白">':"<img src="+t[1]+' alt="" onerror="this.src=\'/images/logo.png\'">'}requestAjax({el:p,url:"/blog/getArtList",type:"get",timeoutFunc:"newArcFn"},function(e){if(!e.status)return alert("服务器错误，请刷新重试");!function(e){for(var i="",t=0;t<e.length;t++){var a=e[t],n=a.id,r=a.title,o=v(a.content),s=a.read,l=a.author.name,c=a.content,d=a.type.name,u=a.time_create;i+='<li><a href="/blog/article/'+n+'"><div class="card"><div class="card-header"><div class="title"><h4><span class="art-type-tips">'+d+"</span>"+r+'</h4></div><div class="info-box"><div class="item read-num"><i class="iconfont bottom icon-eye"></i>'+s+'</div><div class="item author"><i class="iconfont bottom icon-icon_writer"> </i>'+l+'</div><div class="item author"><i class="iconfont bottom icon-time"> </i>'+u+'</div></div></div><div class="card-body"><div class="pic-box">'+o+"</div><p>"+c+"</p></div></div></a></li>"}p.append(i)}(e.data.arcList)})}function weatherFn(){function t(e){requestAjax({el:$("body"),url:"/api/v1/weather/gettheday",type:"get",data:{geolocation:e}},function(e){var i,t,a,n;1===parseInt(e.status)&&(i=e.lives[0],t=i.weather,a=$(".weather"),n=function(e){var i={"sun-shower":["小雨转晴","太阳雨"],"thunder-storm":["雷雨","雷阵雨"],cloudy:["多云","阴"],flurries:["雪","小雪","中雪","大雪","阵雪"],sunny:["晴","晴天"],rainy:["雨","小雨","中雨","阵雨","大雨"]};for(var t in i)if(i.hasOwnProperty(t))for(var a=i[t],n=0;n<a.length;n++)if(a[n]===e)return t}(t),$("."+n).addClass("show"),a.find(".w-up-time").html(i.reporttime),a.find(".w-city").html(i.city),a.find(".w-temp").html(i.temperature),a.find(".w-province").html(i.province))})}$(".weather").on("click",function(){$(this).hasClass("show-more")?($(this).removeClass("show-more"),$("body").css("overflow","auto")):($("body").css("overflow","hidden"),$(this).addClass("show-more"))}),isMobile()?getGeolocation(function(e,i){t(i)}):t(null)}function getGeolocation(n){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(e){var i=e.coords,t=i.longitude,a=i.latitude;return n(null,t+","+a)},function(e){return n(e,null)},{enableHighAccuracy:!0,timeout:2e4,maximumAge:0})}function getCarouselData(){}$(function(){hotArcFn(),newArcFn(),weatherFn()});