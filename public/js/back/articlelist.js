;
var RegP = /(page-)+(\d)/; /* 验证页数 */
var page = 1,
	limit = 10;
$(function () {
	var $table = $('.table');/* 表格 */
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

		var exec = RegP.exec(wrds);/* 匹配 "page-"格式 */
		if (exec) {
			page = Number(exec[2]);/* 赋值页数 */
		} else {
			if (wrds === 'prev') {/* 上翻 页数-1 */
				page--;
			}
			if (wrds === 'next') {/* 下翻 页数+1 */
				page++;
			}
		}
		getNewDatas(page, limit, $table);/* 获取数据 */

	});
	delDataFn(el);
}
/* 删除数据操作函数 */
function delDataFn(){
	var artid = '';/* 文章id */
	var $delBtnMod = ('#delArc_btn');/* 模态框确认按钮 */
	$tableParent = $table.parent('.card-body');/* 表格外层 */
	$tableParent.on('click', '.del-art-btn', function () {/* 单击事件 监听删除按钮 */
		artid = $(this).attr('data-artid');/* 获取文章id并赋值 */
	})
	$tableParent.on('click', '#delArc_btn', function () {/* 单击事件 监听模态框确认按钮 */
		var data = {
			"artid": artid
		};
		/* 发起ajax请求 删除数据 */
		$.ajax({
			url: '/backend/art/remove',
			data: data,
			type: 'post',
			success: function (result) {/* 响应并刷新 */
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
	var data = formatSearch(window.location.search);/* 从问号 (?) 开始的 URL（查询部分）*/
	data.page = page;/* 页数 */
	data.num = limit;/* 单页数量 */
	requestAjax({
		el: $('.table'),
		url: '/backend/art/articlelist',
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8"
	}, function (result) {
		if (result.status !== 1 || result.data === null) return;
		var artInfo = result.data.artInfo;
		var artCount = result.data.artCount;
		var artCon = '';
		for (var i = 0; i < artInfo.length; i++) {
			artCon += '<tr>' +
				'<th scope="row">' + (i + 1) + '</th>' +
				'<td>' + artInfo[i].title + '</td>' +
				'<td>';

			var types = artInfo[i].type_id;
			for (var j = 0; j < types.length; j++) {
				artCon += '<a href="?by[type_id]=' + types[j]._id + '">' + types[j].type_name + '</a>'
			}
			artCon += '</td>' +
				'<td>' + artInfo[i].read + '</td>' +

				'<td>' + artInfo[i].create_time + '</td>' +
				'<td>' + artInfo[i].update_time + '</td>' +
				'<td>' +
				'<a href="updatearticle/' + artInfo[i]._id + '" class="btn btn-info">修改</a>' +
				'<a href="##" data-toggle="modal" data-target="#delArcModal" class="btn btn-danger del-art-btn"  data-artid=' + artInfo[i]._id + '>删除</a>' +
				'</td>' +
				'</tr>';
		}
		$tbody = $el.find('tbody');
		$tbody.empty();
		$tbody.html(artCon);

		/* 分页器 */
		var totalPages = Math.ceil(artCount / 10);/* 根据返回artCount值 计算总页数 */
		var disabled = totalPages == 1 ? ' class="disabled"' : '';
		var nCon = '<ul class="pagination">' +
			'<li' + disabled + '>' +
			'<a href="#" data-page="prev" class="btn-prev" aria-label="上一页">' +
			'<span aria-hidden="true">&laquo;</span>' +
			'</a>' +
			'</li>';
		
		for (var pgs = 1; pgs <= totalPages; pgs++) {
			nCon += '<li><a href="#" class="page" data-page="page-' + pgs + '">' + pgs + '</a></li>'
		}
		nCon += '<li' + disabled + '>' +
			'<a href="#" data-page="next" class="btn-next" aria-label="下一页">' +
			'<span aria-hidden="true">&raquo;</span>' +
			'</a>' +
			'</li>' +
			'</ul>';
		var $navig = $el.parent().find('.navigation');
		$navig.empty().append(nCon);
		var $nextBtn = $('.navigation').find('.btn-next'),
			$prevBtn = $('.navigation').find('.btn-prev'),
			$pageBtn = $('.navigation').find('.page');

		$('.navigation').find('li').removeClass('disabled');
		$pageBtn.each(function () {
			var $this = $(this);
			var wrds = $this.attr('data-page');
			var exec = RegP.exec(wrds);
			if (exec) {
				if (Number(exec[2]) === page) {
					$this.parent('li').addClass('disabled');
				}
			}
		})
		if (page === 1) {
			$prevBtn.parent('li').addClass('disabled');
		}
		if (totalPages === 1) {
			$prevBtn.parent('li').addClass('disabled');
			$nextBtn.parent('li').addClass('disabled');
		}
		if (page === totalPages) {
			$nextBtn.parent('li').addClass('disabled');
		}

	});
}


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