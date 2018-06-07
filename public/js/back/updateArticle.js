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
            name: 'text_content',
            value: editor.txt.html()
        }, {
            name: 'text_conSource',
            value: (editor.txt.text()).substring(0,150)
        });
        console.log(formData);
        $.ajax({
            url: '/backend/art/addarticle',
            type: 'post',
            data: formData,
            success: function (result) {
                console.log(result);
                if (result.status) {
                    window.location.href = window.location.href;
                }
            }
        });
    })


});