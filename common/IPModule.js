const request = require('request');

const amapKey = '9e8d5b997a9d41273bc648fb2fb4d968';

/**
 * 获取客户端ip地址	
 * @param {object} req request请求
 */
let getClientIPAddress = (req) => {
	let ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	let v4Reg = /([1,9]{1}\d{0,2}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
	let v6Reg = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
	if (v4Reg.test(ip) || v6Reg.test(ip)) {
		return ip;
	}
	return ip = false;
}
/**
 * 通过高德ip地址api获取地理位置信息
 * @param {object} ips ip相关信息
 * @param {function} cb 回调函数
 */
let getGeoForAmapAPI = (ips) => {

	let getgelo = (url) => {
		return new Promise((resolve, reject) => {
			request.get(url, function (err, result) {
				if (err) return reject(err);
				let jsonData = JSON.parse(result.body);
				if (parseInt(jsonData.status) !== 1) return reject(0);
				resolve(jsonData);
			});
		})
	}
	return new Promise((resolve, reject) => {
		let url = 'https://restapi.amap.com/v3/ip?ip=' + ips.ip + '&key=' + amapKey;
		let fn = async () => {
			let geoloInfo = await getgelo(url);
			ips.country = '中国';
			ips.city = geoloInfo.city.length !== 0 ? geoloInfo.city : undefined;
			ips.region = geoloInfo.province.length !== 0 ? geoloInfo.province : undefined;
			ips.adcode = geoloInfo.adcode.length !== 0 ? geoloInfo.adcode : undefined;
			ips.rectangle = geoloInfo.rectangle.length !== 0 ? geoloInfo.rectangle : undefined;
			return resolve(ips);
		}
		fn().catch(err => {
			return resolve(ips);
		})
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

function taobaoGeoApi() {
	return new Promise((resolve, reject) => {

	})
	/*淘宝ip接口 解析ip地址 */
	let url = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ipInfo.ip;
	request.get(url, (error, response, body) => {
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

/**
 * 获取客户端地理信息
 * @param {object} req request请求
 * @param {function} callback 回调函数
 */
let getClientGeoloInfo = (req) => {
	return new Promise(async (resolve, reject) => {
		let ipInfo = {};
		ipInfo.ip = getClientIPAddress(req);
		if (!ipInfo.ip) {
			ipInfo.ip = "未知领域";
			return resolve(ipInfo);
		}
		console.log(`当前ip：${ipInfo.ip}`);
		let ips = await getGeoForAmapAPI(ipInfo);
		resolve(ips);
	})


};
module.exports = {
	getClientGeoloInfo,
	getClientIPAddress
};