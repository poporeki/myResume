function updateTime(a,i,r){setTimeout(function(){var e=new Date,n=(e.getFullYear(),e.getHours()),t=e.getMinutes(),s=e.getSeconds();function o(e){return e<10?"0"+e:e}a.innerText=o(n),i.innerText=o(t),r.innerText=o(s),updateTime(a,i,r)},1e3)}function saveInput(e,n){e.value=sessionStorage.getItem("unVal"),n.value=sessionStorage.getItem("upVal")}function inputFn(){var e=$(".control").find(".form-control");function n(e){e.each(function(){$par=$(this).parent(),""!==$(this).val()?$par.addClass("active"):$par.removeClass("active")})}n(e),e.on("focus",function(){$(this).parent().addClass("active")}),e.on("blur",function(){n($(this))})}function submitLogin(a,i){var n=$("#login_btn");$(document).keydown(function(e){13==e.keyCode&&n.click()}),n.on("click submit",function(e){e.preventDefault();var n=a.value,t=i.value;if(""!==n&&void 0!==n&&""!==t&&void 0!==t){var s=$(this),o=s.parent(".login-btn-box").find(".status-block");o.hasClass("error")||o.hasClass("success")||o.hasClass("logining")||o.hasClass("hide")||(sessionStorage.setItem("unVal",n),sessionStorage.setItem("upVal",t),$.ajax({url:"/login",type:"post",data:{uname:n,upwd:t},beforeSend:function(){o.html("登录中").removeClass().addClass("status-block logining").append('<div class="loading-ani"></div>')},success:function(t){if(t){if(t.status){o.addClass("success").html(t.msg);var e=s.parents(".login-box"),n=e.find(".inner");e.addClass("success"),n.on("animationend",function(){var e="",n=document.referrer;n=n.split("/")[3],e=document.referrer&&document.referrer!==window.location.href&&"reg"!=n?document.referrer:t.href,window.location.href=e})}else o.addClass("error").html(t.msg),setTimeout(function(){o.addClass("hide").one("animationend",function(){$(this).html("").removeClass().addClass("status-block")})},2e3)}}}))}else alert("内容不能为空")})}window.onload=function(){document.querySelector(".card__hours"),document.querySelector(".card__minutes"),document.querySelector(".card__seconds");var e=document.querySelector("#username"),n=document.querySelector("#upassword");saveInput(e,n),inputFn(),submitLogin(e,n)};