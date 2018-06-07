$(function(){
    var $sideMenuLk=$('.side-menu .nav').find('a');
    $sideMenuLk.each(function(){
      if($(this).attr('href')===window.location.pathname){
        $(this).parents('li').addClass('active');
      }
    })
    console.log("a"+window.location.pathname);
  });
  