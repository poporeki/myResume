var E = window.wangEditor;
var editor = new E('#editor');
// 配置服务器端地址
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
          window.location.href = window.location.href;
        }
      }
    });
  })


});