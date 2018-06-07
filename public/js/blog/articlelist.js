$(function () {
    var $artList = $('.article-list');
    var page = 1;
    var SEND = false;
    var cs = formatSearch(window.location.search);

    $(window).on('scroll', function () {
        var H = $artList.offset().top;
        var outH = $artList.outerHeight();
        var sTop = $(window).scrollTop();
        var elBottomDistanceWindowTop = H + outH - sTop;
        console.log(H + ':::' + sTop + '====' + (elBottomDistanceWindowTop < outH));
        if (elBottomDistanceWindowTop < $(window).height() && SEND == false) {
            getNewData();
            var a = /\[[^\}]+\]/;
        }
    })

    function getNewData() {
        SEND = true;
        page += 1;
        cs['page'] = page;
        cs['num'] = 10;
        var jsonCS = JSON.stringify(cs);
        $.ajax({
            url: '/blog/articlelist',
            type: 'post',
            contentType: "application/json;charset=utf-8",
            data: jsonCS,
            success: function (result) {

                SEND = false;
                if (result.status == 1) {
                    var html = '';
                    var con = result.result;
                    for (var i = 0; i < con.length; i++) {
                        html += '<li class="article-list-item">' +
                            '<a href="/blog/article/' + con[i].artid + '">' +
                            '<div class="lt">' +
                            '<div class="top">' +
                            '<div class="title">' +
                            '<h4>' + con[i].title + '</h4>' +
                            '</div>' +
                            '<div class="time">' + con[i].create_time + '</div>' +
                            '</div>' +

                            '<div class="thumbnail"><%=artList[i].source%></div>' +
                            '</div>' +

                            '</a>' +
                            '</li>'
                    }
                    $artList.append(html);
                } else {
                    SEND = true;
                    alert(result.msg);
                }
            }
        });
    }
});
/* 当前url参数转为对象 */
function formatSearch(se) {
    if (typeof se !== "undefined") {
        se = se.substr(1);
        var arr = se.split("&"),
            obj = {},
            newarr = [],
            Reg = /([^\)]*)\[([^\)]*)\]/; /* 匹配  [内容] */
        $.each(arr, function (i, v) {
            newarr = v.split("=");
            if (typeof obj[newarr[0]] === "undefined") {
                var n0 = newarr[0];
                var exec = Reg.exec(n0); /* 匹配 by[id]=11形式 */
                if (exec) {
                    if (typeof obj['by'] === "undefined") {
                        obj['by'] = {};
                    }
                    var key = exec[2];
                    obj.by[key] = newarr[1];
                    return;
                }
                obj[newarr[0]] = newarr[1];
            }
        });
        return obj;
    }
}