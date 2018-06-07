/* 背景图片地址 */
var imgurl = {
  page1: "../images/bg-1.jpg",
  page2: "../images/bg-2.jpg",
  page3: "../images/bg-3.jpg",
  page4: "../images/bg-4.jpg",
  page5: "../images/bg-5.jpg",
  page6: "../images/bg-6.jpg"
};
/* 预加载背景图 */
var loadingNum = document.getElementsByClassName('loading-num')[0];

function preloadImg(imgurl) {
  var imgWrap = [];
  var idx = 0;
  var startNum = 0;
  console.log(typeof imgurl)
  var keys = Object.keys(imgurl)
  for (var i in imgurl) {
    var obj = new Image();
    obj.src = imgurl[i];
    obj.onload = function () {
      idx++;
      var num = (idx / keys.length * 100).toFixed(2);
      loadingNum.innerText = num;
    }


  }

}

/* 设置背景图片 */
$('.body-bg').css({
  "background-image": 'url("' + imgurl['page1'] + '")'
})



/* 改变背景 */
function changeBg(nextIndex, dire) {
  var $pageBg = $('.body-bg'),
    /* 背景底层 */
    $pageBgUp = $pageBg.find('.page-up-bg'); /*背景上层  */

  var aniName, _idx; /* aniName 动画效果名，_idx下一页索引 */
  var arrbg = Object.keys(imgurl);
  if (nextIndex > arrbg.length) return; /* 当下一页索引大于背景图片数量 则返回 */
  _idx = nextIndex;

  dire === 'down' ? aniName = 'fadeInUp' : ''; /* 鼠标滚轮向下滚动时 动画效果 */
  dire === 'up' ? aniName = 'fadeInDown' : ''; /* 鼠标滚轮向上滚动时 动画效果 */
  /* 变更上层背景图片地址 */
  $pageBgUp.css({
    "background-image": 'url("' + imgurl['page' + _idx] + '")'
  }).animateCss(aniName, function () { /* 执行动画，动画结束后,变更底层背景图片 */
    $pageBg.css({
      "background-image": 'url("' + imgurl['page' + _idx] + '")'
    })
  });
  // $pageBgUp.removeClass().addClass('page-up-bg page' + _idx+'-img').animateCss(aniName, function () { /* 执行动画，动画结束后,变更底层背景图片 */
  // 	$pageBg.removeClass().addClass('body-bg page' + _idx+'-img');
  // });
}