;
$(function () {
	/* 背景图片地址 */
	var imgurl = {
		page1: "../images/bg-1.jpg",
		page2: "../images/bg-2.jpg",
		page3:"../images/bg-3.jpg",
		page4:"../images/bg-4.jpg",
		page5:"../images/bg-5.jpg",
		page6:"../images/bg-6.jpg"
	}
	var $page = $('.page-item'),
		$navbar = $('.navbar');

	var $menu_sidebar = $(".menu-sidebar");
	//侧边菜单
	$('.control-menu,.menu-sidebar .s-mask,.menu-sidebar a').on('click', function () {
		$menu_sidebar.fadeToggle();
	})
	/* 设置背景图片 */
	$('.body-bg').css({
		"background-image": 'url("' + imgurl['page1'] + '")'
	})


	/* 预加载背景图 */
	function preloadImg(imgurl) {
		var imgWrap = [];
		var idx = 0;
		for (var i in imgurl) {
			imgWrap[idx] = new Image();
			imgWrap[idx].src = imgurl[i];
			idx++;
		}

	}
	preloadImg(imgurl);
	/* 改变背景 */
	function changeBg(nextIndex, dire) {
		var $pageBg = $('.body-bg'),/* 背景底层 */
			$pageBgUp = $pageBg.find('.page-up-bg');/*背景上层  */
		var aniName, _idx;/* aniName 动画效果名，_idx下一页索引 */
		var arrbg = Object.keys(imgurl);
		if (nextIndex > arrbg.length) return;/* 当下一页索引大于背景图片数量 则返回 */
		_idx = nextIndex;

		dire === 'down' ? aniName = 'fadeInUp' : '';/* 鼠标滚轮向下滚动时 动画效果 */
		dire === 'up' ? aniName = 'fadeInDown' : '';/* 鼠标滚轮向上滚动时 动画效果 */
		/* 变更上层背景图片地址 */
		$pageBgUp.css({
			"background-image": 'url("' + imgurl['page' + _idx] + '")'
		}).animateCss(aniName, function () {/* 执行动画，动画结束后,变更底层背景图片 */
			$pageBg.css({
				"background-image": 'url("' + imgurl['page' + _idx] + '")'
			})
		});
	}
	/* 得到jQuery元素 n为父元素或索引，ele为查找的元素 */
	var get$Ele=function(n,ele){
		if (typeof n === 'object') {
			return $(n).find(ele);
		}
		return $page.eq(n).find(ele);
	}
	
	/* fullpage */
	var full = $('#fullpage').fullpage({
		sectionSelector: '.page-item',
		navigation: true,
		navigationPosition: 'right',
		showActiveTooltip: true,
		navigationTooltips: ['Home', '关于我', '职业技能', '作品展示', '联系我', '底部'],
		controlArrowColor: 'rgba(0,0,0,.4)',
		/* paddingTop: 55, */
		resize: true,
		vertical: true,
		sectionsColor: ['', '', 'rgba(0,0,0,.2)', 'rgba(0,0,0,.2)'],
		anchors: ['fp-page1', 'fp-page2', 'fp-page3', 'fp-page4', 'fp-page5', 'fp-page6'],
		scrollOverflow: true,
		css3: true,
		animateAnchor: true,
		normalScrollElements: '.menu-sidebar',
		/* responsiveWidth: 600, */
		afterRender: function () {
			/* 移除载入动画 */
			move('.loading-animate')
				.scale(.5)
				.duration('.5s')
				.end(function () {
					move('.loading-animate')
						.translate(3000, 0)
						.ease('in')
						.duration('.5s')
						.end(function () {
							$('#loading-animate').remove();/* 动画结束时移除 */
							/* 载入首屏动画 */
							get$Ele(0,'.page-title').animateCss('zoomInUp');
							get$Ele(0,'.title-hr').animateCss('fadeInUp', function () {
								get$Ele(0,'h4').animateCss('fadeInUp', function () {
									get$Ele(0,'.page-btn-block').animateCss('fadeInUp');
									get$Ele(0,'.page-two-btn').animateCss('fadeInDown');
								})
							})
						});
				})
		},
		afterLoad: function (i, pageNum) {
			var _idx = pageNum - 1,
				$tit = get$Ele(this,'.page-title'),/* 当页标题 */
				$con = get$Ele(this,'.page-content'),/* 当页内容块 */
				$panel = $con.find('.panel'),
				$pageTwoBtn = get$Ele(this,'.page-two-btn');
			/* Navbar在第一页的时候添加class(navtop) 其他页数移除class */
			pageNum === 1 ? $navbar.addClass('navtop') : $navbar.removeClass('navtop');
			/* 延迟执行动画 $el=目标元素 t=延迟时间(单位：ms) */
			function delayAni($el,t) {
				var n = 0;
				/* 遍历元素 */
				$.each($el, function () {
					n += t;
					move(this).scale(1).delay(n).duration('.5s').end();
				});
			}
			switch (pageNum) {
				case 1:
					move($tit[0]).scale(1).end();
					break;
				case 3:
					$tit
						.css({"display": 'inline-block'})
						.addClass('page-title-ani');
					delayAni($panel,100);
					break;
				case 4:
					delayAni($panel,100);
					move($tit[0]).scale(1).end();
					break;
				case 5:
			}
		},
		onLeave: function (index, nextIndex, dire) {
			var _idx = index - 1,
				$tit = get$Ele(this,'.page-title'),
				$con = get$Ele(this,'.page-content'),
				$panel = $con.find('.panel'),
				$pageTwoBtn = get$Ele(this,'.page-two-btn');

			changeBg(nextIndex, dire); /* 改变背景图 */
			switch (index) {
				case 1:
					move($pageTwoBtn[0]).scale(0).end();
					break;
				case 2:
					break;
				case 3:
					$tit
						.removeClass('page-title-ani')
						.css({"display": 'none'});
					$panel.animateCss('bounceOut', function (el) {
						$(el).css({
							'transform': 'scale(0)'
						});
					});
					break;
			}

		}
	});
});

// $(function () {
// 	/* keyCode */
// 	var $codeInput = $('.keycode-input');
// 	var $showKeycode = $('.show-keycode');
// 	$($codeInput).keydown(function (ev) {
// 		$codeInput.val('');
// 		var keyCode = ev.which;
// 		$showKeycode.text("keyCode为：" + keyCode);
// 	})
// });