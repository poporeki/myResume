window.onload = function () {
	var spanHours = document.querySelector('.card__hours');
	var spanMinutes = document.querySelector('.card__minutes');
	var spanSeconds = document.querySelector('.card__seconds');
	var inputUser = document.querySelector('#username');
	var inputPwd = document.querySelector('#upassword');
	inputUser.focus();
	updateTime(spanHours, spanMinutes, spanSeconds);
	saveInput(inputUser, inputPwd);
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

function submitLogin(u, p) {
	var $loginBtn = $('#login_btn');
	$(document).keydown(function (event) {
		if (event.keyCode == 13) {
			$loginBtn.click();
		}
	});
	$loginBtn.on('click submit', function (e) {
		e.preventDefault();

		var _this = $(this);
		if (_this.hasClass('error') || _this.hasClass('success')) return;
		var unVal = u.value;
		var upVal = p.value;
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
				_this.removeAttr('href');
				_this.val('登录中');
			},
			success: function (data) {
				if (!data) return;
				if (data.status) {
					_this.addClass('success');

					_this.val(data.msg);
					var $boxPar = _this.parents('.login-box');
					setTimeout(function () {
						$boxPar.addClass('success');
					}, 1000);
					var $inner = $boxPar.find('.inner');
					$inner[0].addEventListener('animationend', function () {
						window.location.href = data.href;
					})
					// setTimeout(function () {
					// 	window.location.href = data.href;
					// }, 2000);
				} else {
					_this.addClass('error');
					_this.val(data.msg);
					setTimeout(function () {
						_this.removeClass('error');
						_this.val('登录');
					}, 2000);
				}

			}
		})
	})
}