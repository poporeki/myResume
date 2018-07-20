/**
 * *添加文章
 * 
 */
var E = window.wangEditor;
var editor = new E('#editor');
editor.customConfig.zIndex = 1000;
/* 配置服务器端地址 */
editor.customConfig.uploadImgMaxLength = 1;
editor.customConfig.uploadImgTimeout = 30000;
editor.customConfig.uploadImgServer = '/backend/art/uploadArtIMG';
editor.create();
$(function () {

  var $submitBtn = $('.submit-btn');

  $submitBtn.on('click submit', function (e) {
    e.preventDefault();
    var formData = $('form').serializeArray();
    formData.push({
      name: 'arc_content',
      value: editor.txt.html()
    }, {
      name: 'arc_conSource',
      value: (editor.txt.text()).substring(0, 150)
    });
    console.log(formData);
    var submitURL = $(this).attr('data-submitURL');
    $.ajax({
      url: submitURL,
      type: 'post',
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.status) {
          if (result.href) {
            window.location.href = result.href;
            return;
          }
          confirm('是否继续') ? window.location.href = window.location.href : window.location.href = '/backend/art/articlelist';
        }
      }
    });
  })




  $('.form-layout .form-control').on('focusin', function () {
    $(this).closest('.form-group').addClass('form-group-active');
  });

  $('.form-layout .form-control').on('focusout', function () {
    $(this).closest('.form-group').removeClass('form-group-active');
  });

  // Select2
  $('#select2-a, #select2-b').select2({
    minimumResultsForSearch: Infinity
  });

  $('#select2-a').on('select2:opening', function (e) {
    $(this).closest('.form-group').addClass('form-group-active');
  });

  $('#select2-a').on('select2:closing', function (e) {
    $(this).closest('.form-group').removeClass('form-group-active');
  });
});