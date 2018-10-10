const request = require('request');

const getIP = require('./getIP');
/* 获取客户端ip */

const gdKEY = '9e8d5b997a9d41273bc648fb2fb4d968';

function getClientIp(req, callback) {
	let ipInfo = {};
	ipInfo.ip = getIP(req);
	if (!ipInfo.ip) {
		ipInfo.ip = "未知领域";
		return callback(ipInfo);
	}
	console.log(`当前ip：${ipInfo.ip}`);
	gaodeAPI(ipInfo, callback);

};

function gaodeAPI(ips, cb) {

	let url = 'https://restapi.amap.com/v3/ip?ip=' + ips.ip + '&key=' + gdKEY;
	let getgelo = () => {
		return new Promise((resolve, reject) => {
			request.get(url, function (err, result) {
				if (err) return reject(err);
				let jsonData = JSON.parse(result.body);
				if (parseInt(jsonData.status) !== 1) return reject(0);
				resolve(jsonData);

			});
		})
	}
	getgelo()
		.then(result => {
			ips.country = '中国';
			ips.city = result.city.length !== 0 ? result.city : undefined;
			ips.region = result.province.length !== 0 ? result.province : undefined;
			ips.adcode = result.adcode.length !== 0 ? result.adcode : undefined;
			ips.rectangle = result.rectangle.length !== 0 ? result.rectangle : undefined;
			return cb(ips);
		})
}

function isJSON(str) {
	if (typeof str == 'string') {
		try {
			let obj = JSON.parse(str);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}

		} catch (e) {
			console.log('error：' + str + '!!!' + e);
			return false;
		}
	}
	console.log('It is not a string!')
}

function tb() {
	/*淘宝ip接口 解析ip地址 */
	request.get('http://ip.taobao.com/service/getIpInfo.php?ip=' + ipInfo.ip, (error, response, body) => {
		console.log(typeof body);
		if (error && response ? response.statusCode !== 200 : false || !isJSON(body)) {
			return callback(ipInfo);
		}
		console.log(`内容为：${body}`);
		let datas = JSON.parse(body);
		if (datas.code === 1) return callback(ipInfo);
		let data = datas.data;
		ipInfo.country = data.country;
		ipInfo.country_id = data.country_id;
		ipInfo.city = data.city;
		ipInfo.city_id = data.city_id;
		ipInfo.region = data.region;
		ipInfo.isp = data.isp;
		return callback(ipInfo);
	})
}
module.exports = getClientIp;