window.onload = function () {
	var spanHours = document.querySelector('.card__hours');
	var spanMinutes = document.querySelector('.card__minutes');
	var spanSeconds = document.querySelector('.card__seconds');
	var inputUser = document.querySelector('#username');
	var inputPwd = document.querySelector('#upassword');
	/* updateTime(spanHours, spanMinutes, spanSeconds); */
	saveInput(inputUser, inputPwd);
	inputFn();
	submitLogin(inputUser, inputPwd);
}


function updateTime(h, m, s) {
	setTimeout(function () {
		var nowDate = new Date();
		var year = nowDate.getFullYear();
		var hour = nowDate.getHours();
		var minute = nowDate.getMinutes();
		var second = nowDate.getSeconds();

		function addZero(num) {
			return num < 10 ? '0' + num : num;
		}
		h.innerText = addZero(hour);
		m.innerText = addZero(minute);
		s.innerText = addZero(second);
		updateTime(h, m, s);
	}, 1000);
}

function saveInput(u, p) {
	u.value = sessionStorage.getItem('unVal');
	p.value = sessionStorage.getItem('upVal');
}

function inputFn() {
	var $wrap = $('.control'),
		$input = $wrap.find('.form-control');
	addActive($input);
	$input.on('focus', function () {
		$(this).parent().addClass('active');
	});
	$input.on('blur', function () {
		addActive($(this));
	});

	function addActive(el) {
		var $this = el;


		$this.each(function () {
			$par = $(this).parent();
			var val = $(this).val();
			if (val !== '') {
				$par.addClass('active');
			} else {
				$par.removeClass('active');
			}
		})

	}
}

function submitLogin(u, p) {
	var $loginBtn = $('#login_btn');
	$(document).keydown(function (event) {
		if (event.keyCode == 13) {
			$loginBtn.click();
		}
	});
	$loginBtn.on('click submit', function (e) {
		e.preventDefault();
		var unVal = u.value;
		var upVal = p.value;
		if (unVal === '' || unVal === undefined || upVal === '' || upVal === undefined) {
			alert('内容不能为空');
			return;
		}
		var $this = $(this),
			$btnBox = $this.parent('.login-btn-box'),
			$statusBox = $btnBox.find('.status-block');
		if ($statusBox.hasClass('error') || $statusBox.hasClass('success') || $statusBox.hasClass('logining') || $statusBox.hasClass('hide')) return;


		sessionStorage.setItem('unVal', unVal);
		sessionStorage.setItem('upVal', upVal);
		$.ajax({
			url: '/login',
			type: 'post',
			data: {
				uname: unVal,
				upwd: upVal
			},
			beforeSend: function () {
				$statusBox.html('登录中').removeClass().addClass('status-block logining').append('<div class="loading-ani"></div>');
			},
			success: function (data) {
				if (!data) return;
				var transitionFlag = true;
				if (data.status) {
					$statusBox.addClass('success').html(data.msg);
					var $boxPar = $this.parents('.login-box');
					var $inner = $boxPar.find('.inner');
					$boxPar.addClass('success');
					$inner.on('animationend', function () {
						var href = '';
						var ref = document.referrer;
						ref = ref.split('/')[3];
						if (document.referrer && document.referrer !== window.location.href && ref != 'reg') {
							href = document.referrer;
						} else {
							href = data.href;
						}

						window.location.href = href;
					})
				} else {
					$statusBox.addClass('error').html(data.msg);
					setTimeout(function () {
						$statusBox.addClass('hide').one('animationend', function () {
							$(this).html('').removeClass().addClass('status-block');
						})
					}, 2000);


				}

			}
		})
	})
}