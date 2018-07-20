;
var RegP = /(page-)+(\d)/; /* 验证页数 */
var page = 1,
	limit = 10;
$(function () {
	var $table = $('.table'); /* 表格 */
	readyFn($table);
});

function readyFn(el) {
	var $table = el;
	var data = {};
	getNewDatas(page, limit, $table);
	$table_wrap = $table.parent();
	$table_wrap.on('click', '.pagination>li>a', function () {
		var $this = $(this);
		if ($this.parent('li').hasClass('disabled')) return;
		var wrds = $this.attr('data-page');

		var exec = RegP.exec(wrds); /* 匹配 "page-"格式 */
		if (exec) {
			page = Number(exec[2]); /* 赋值页数 */
		} else {
			if (wrds === 'prev') { /* 上翻 页数-1 */
				page--;
			}
			if (wrds === 'next') { /* 下翻 页数+1 */
				page++;
			}
		}
		getNewDatas(page, limit, $table); /* 获取数据 */

	});
	delDataFn(el);
}

/* 删除数据操作 */
function delDataFn(el) {
	var $table = el;
	var artid = ''; /* 文章id */
	var $delBtnMod = $('#delArc_btn'); /* 模态框确认按钮 */
	$table.on('click', '.del-art-btn', function () { /* 单击事件 监听删除按钮 */
		artid = $(this).attr('data-artid'); /* 获取文章id并赋值 */
	})
	$delBtnMod.on('click', function () { /* 单击事件 监听模态框确认按钮 */
		var data = {
			"artid": artid
		};
		/* 发起ajax请求 删除数据 */
		$.ajax({
			url: '/backend/art/remove/toTrash',
			data: data,
			type: 'post',
			success: function (result) { /* 响应并刷新 */
				if (result.status == 1) {
					alert('删除成功');
					getNewDatas(page, limit, $table);
				};
				if (result.status == 0) {
					alert('删除失败：' + result.msg);
				}
			}
		})
	})
}
/* 获取新数据 */
function getNewDatas(page, limit, $el) {
	var data = formatSearch(window.location.search); /* 从问号 (?) 开始的 URL（查询部分）*/
	data.page = page; /* 页数 */
	data.num = limit; /* 单页数量 */
	requestAjax({
		el: $('.table').find('tbody'),
		url: '/backend/art/articlelist',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8"
	}, function (result) {
		if (result.status !== 1 || result.data === null) return;
		var artInfo = result.data.artInfo;
		$tbody = $el.find('tbody');
		$tbody.empty();
		if (artInfo.length === 0) {
			return $tbody.html('没有数据');
		}
		var artCount = result.data.artCount;
		var artCon = '';
		for (var i = 0; i < artInfo.length; i++) {
			var info = artInfo[i],
				artnum = i + 1,
				artid = info.id,
				arttit = info.title,
				typeid = info.type.id,
				typename = info.type.name,
				read = info.read,
				time_create = info.time_create,
				time_lastchange = info.time_lastchange;

			artCon +=
				'<tr>' +
				'<th scope="row">' + artnum + '</th>' +
				'<td>' + arttit + '</td>' +
				'<td>' +
				'<a class="badge badge-light" href="?by[type_id]=' + typeid + '">' + typename + '</a>' +
				'</td>' +
				'<td>' + read + '</td>' +
				'<td>' + time_create + '</td>' +
				'<td>' + time_lastchange + '</td>' +
				'<td>' +
				'<a href="updatearticle/' + artid + '" class="btn btn-teal btn-block">修改</a>' +
				'<a href="javascript:void(0);" data-toggle="modal" data-target="#delArcModal" class="btn btn-dark btn-block del-art-btn"  data-artid=' + artid + '>删除</a>' +
				'</td>' +
				'</tr>';
		}
		$tbody.html(artCon);
		/* 更新分页器 */
		refreshPaginator($el, artCount);
	});
}