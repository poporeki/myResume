var imgurl={page1:"../images/bg-1.jpg",page2:"../images/bg-2.jpg",page3:"../images/bg-3.jpg",page4:"../images/bg-4.jpg",page5:"../images/bg-5.jpg",page6:"../images/bg-6.jpg"},loadingNum=document.getElementsByClassName("loading-num")[0];function preloadImg(g){var a=0;console.log(typeof g);var e=Object.keys(g);for(var n in g){var i=new Image;i.src=g[n],i.onload=function(){var g=(++a/e.length*100).toFixed(2);loadingNum.innerText=g}}}function changeBg(g,a){var e,n,i=$(".body-bg"),o=i.find(".page-up-bg");g>Object.keys(imgurl).length||(n=g,"down"===a&&(e="fadeInUp"),"up"===a&&(e="fadeInDown"),o.css({"background-image":'url("'+imgurl["page"+n]+'")'}).animateCss(e,function(){i.css({"background-image":'url("'+imgurl["page"+n]+'")'})}))}$(".body-bg").css({"background-image":'url("'+imgurl.page1+'")'});