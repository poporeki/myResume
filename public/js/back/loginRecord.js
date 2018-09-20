$(function () {
  $('.table').pagination({
    updateDataURL: '/backend/loginrecord',
    limit: 20,
    process: function (result) {

      var datas = result.data;
      var count = datas.count;
      var list = datas.list;
      var Con = '';
      for (var i = 0, Len = list.length; i < Len; i++) {
        var data = list[i];

        var username = data.username,
          os = data.os,
          browser = data.browser,
          ip = data.ip,
          address = data.address,
          isp = data.isp,
          logtime = data.logtime;
        Con += '<tr>' +
          '<th scope="row">' + username + '</th>' +
          '<td>' + os + '</td>' +
          '<td>' + os + '</td>' +
          '<td>' + browser + '</td>' +
          '<td>' + ip + '<br>' + '</td>' +
          '<td>' + address + '</td>' +
          '<td>' + isp + '</td>' +
          '<td>' + logtime + '</td>' +
          '</tr>';
      }
      return {
        addHtml: Con,
        Count: count
      }

    }
  })
})