$(function(){
    backToTopFn();
});
/* 返回顶部 */
function backToTopFn(){
    var $backTopBtn=$('#back_to_top');/* 按钮 */
    showIt($backTopBtn);/* 显示隐藏 */
    $(document).on('mousewheel',function(){/* 页面滚动时 */
        showIt($backTopBtn);
    })
    listeningFn($backTopBtn);/* 监听按钮单击 */
}

function showIt($el){
    var sTop =$(window).scrollTop();
    var wHei=$(window).height();
    console.log('距离顶部高度：'+sTop,',,窗口高度：'+wHei)
    if(sTop-wHei>-wHei){
        $el.fadeIn();
    }else{
        $el.fadeOut();
    }
}

function listeningFn($el){
    $el.on('click',function(){
        $("html,body").animate({scrollTop:0})
    })
}