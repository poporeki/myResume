$(function () {
  var $menu_sidebar = $(".menu-sidebar");
  //侧边菜单
  $('.control-menu,.menu-sidebar .s-mask,.menu-sidebar a').on('click', function () {
    $menu_sidebar.hasClass('show') ? $menu_sidebar.removeClass('show') : $menu_sidebar.addClass('show');
  })
});