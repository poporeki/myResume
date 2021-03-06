$(function () {
	$('.table').pagination({
		updateDataURL: '/backend/art/articlelist',
		delDataURL: '/backend/art/remove/toTrash',
		process: function (result) {
			var artCount = result.data.artCount;
			var artCon = '';
			var artInfo = result.data.artInfo.arclist;
			for (var i = 0; i < artInfo.length; i++) {
				var info = artInfo[i],
					artnum = i + 1,
					artid = info.id,
					arttit = info.title,
					typeid = info.type.id,
					typename = info.type.name,
					tags = info.tags,
					read = info.read,
					time_create = info.time_create,
					time_lastchange = info.time_update;
				var tagHtml = '<td>';
				for (var t = 0; t < tags.length; t++) {
					if (t === tags.length - 1) {
						tagHtml += '<a class="badge badge-light" href="?by[tags_id]=' + tags[t]._id + '">' + tags[t].tag_name + '</a>' + '</td>'
					} else {
						tagHtml += '<a class="badge badge-light" href="?by[tags_id]=' + tags[t]._id + '">' + tags[t].tag_name + '</a>'
					}
				}
				artCon +=
					'<tr>' +
					'<th scope="row">' + artnum + '</th>' +
					'<td><a class="tx-inverse" href="/blog/article/' + artid + '">' + arttit + '</a></td>' + tagHtml +
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
			return {
				Count: artCount,
				addHtml: artCon
			}
		}
	})
})