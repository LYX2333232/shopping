import {
	UserStore
} from '@/store/index.js';
// import { MD5 } from 'crypto-js';

let baseUrl = import.meta.env.VITE_API_BASE_URL

const request = {
	post(url, data = {}, load = true) {

		if (load) {
			uni.showLoading({
				title: '加载中...'
			});
		}

		let options = {
			url,
			data,
			method: 'POST',
		}

		options.url = `${baseUrl}${options.url}`;
		// 判断本地是否存在token，如果存在则带上请求头

		// console.log(UserStore().auth.access_token);

		options.header = {
			'Accept': 'application/json',
			'content-type': 'application/json',
			'Authorization': UserStore().auth.access_token ? `Bearer ${UserStore().auth.access_token}` :
				'' // 这里是token(可自行修改)
		}

		// let time = Math.floor(Date.now() / 1000);
		// let bytes = new Uint8Array(5);


		// let randomString = generateRandomString(8); 

		// let md5 = MD5('digua_' + time+ "_" + randomString).toString();


		//  function generateRandomString(length) {
		//    var result = '';
		//    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		//    var charactersLength = characters.length;

		//    for (var i = 0; i < length; i++) {
		//      result += characters.charAt(Math.floor(Math.random() * charactersLength));
		//    }

		//    return result;
		//  } 
		// let param = {
		// 	t: time,
		// 	n: randomString,
		// 	iv: md5
		// }

		// options.header = { ...options.header, ...param };
		// resolved是返回成功数据，rejected返回错误数据
		return new Promise((resolved, rejected) => {
			options.success = (res) => {

				uni.hideLoading();
				// console.log(res)
				// 如果请求回来的状态码不是200则执行以下操作
				if (res.data.code !== 200 && res.data.code !== 401 && res.data.code !== 410) {
					// 非成功状态码弹窗
					uni.showToast({
						icon: 'none',
						duration: 3000,
						title: `${res.data.message}`
					});
					// 这里可以做一些状态码判断以及操作
					// 返回错误信息 
				} else if (res.data.code == 200) {
					// 请求回来的状态码为200则返回内容
					resolved(res.data)
				} else {
					// 用户未登录,弹出提示
					uni.showModal({
						// confirmColor: "#a4192e",
						// confirmText: "请先登录",
						title: '您未登录',
						success(ts) {
							if (ts.confirm) {
								UserStore().login()
							}
						}
					})
				}

			};
			options.fail = (err) => {
				// 请求失败弹窗
				uni.hideLoading();
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '网络错误,请稍后再试'
				});
				rejected(err);
			};
			uni.request(options);
		});
	},
	get(url, data = {}, load = true) {
		if (load) {
			uni.showLoading({
				title: '加载中...'
			});
		}

		let options = {
			url,
			data,
			method: 'GET',
		}
		options.url = `${baseUrl}${options.url}`;
		// 判断本地是否存在token，如果存在则带上请求头

		options.header = {
			'Accept': 'application/json',
			'content-type': 'application/json',
			'Authorization': UserStore().auth.access_token ? `Bearer ${UserStore().auth.access_token}` : '', // 这里是token(可自行修改)

		}
		// let time = Math.floor(Date.now() / 1000);
		// let bytes = new Uint8Array(5);


		// let randomString = generateRandomString(8); 

		// let md5 = MD5('digua_' + time+ "_" + randomString).toString();


		//  function generateRandomString(length) {
		//    var result = '';
		//    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		//    var charactersLength = characters.length;

		//    for (var i = 0; i < length; i++) {
		//      result += characters.charAt(Math.floor(Math.random() * charactersLength));
		//    }

		//    return result;
		//  } 
		// let param = {
		// 	t: time,
		// 	n: randomString,
		// 	iv: md5
		// }
		// options.header = { ...options.header, ...param };
		// resolved是返回成功数据，rejected返回错误数据
		return new Promise((resolved, rejected) => {
			options.success = (res) => {
				uni.hideLoading();
				if (res.data.code !== 200 && res.data.code !== 401 && res.data.code !== 410) {
					// 非成功状态码弹窗
					uni.showToast({
						icon: 'none',
						duration: 3000,
						title: `${res.data.message}`
					});
					// 这里可以做一些状态码判断以及操作
					// 返回错误信息 
				} else if (res.data.code == 200) {
					// 请求回来的状态码为200则返回内容
					resolved(res.data)
				} else {
					// 用户未登录,弹出提示
					uni.showModal({
						// confirmColor: "#a4192e",
						// confirmText: "请先登录",
						title: '您未登录',
						success(ts) {
							if (ts.confirm) {
								UserStore().login()
							}
						}
					})
				}
			};
			options.fail = (err) => {
				// 请求失败弹窗 
				uni.hideLoading();
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '网络错误,请稍后再试'
				});
				rejected(err);
			};
			uni.request(options);
		});
	},
	delete(url, data = {}, load = true) {
		if (load) {
			uni.showLoading({
				title: '加载中...'
			});
		}

		let options = {
			url,
			data,
			method: 'DELETE',
		}
		options.url = `${baseUrl}${options.url}`;
		// 判断本地是否存在token，如果存在则带上请求头

		options.header = {
			'Accept': 'application/json',
			'content-type': 'application/json',
			'Authorization': UserStore().auth.access_token ? `Bearer ${UserStore().auth.access_token}` : '', // 这里是token(可自行修改)

		};
		// let time = Math.floor(Date.now() / 1000);
		// let bytes = new Uint8Array(5);


		// let randomString = generateRandomString(8); 

		// let md5 = MD5('digua_' + time+ "_" + randomString).toString();


		//  function generateRandomString(length) {
		//    var result = '';
		//    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		//    var charactersLength = characters.length;

		//    for (var i = 0; i < length; i++) {
		//      result += characters.charAt(Math.floor(Math.random() * charactersLength));
		//    }

		//    return result;
		//  } 
		// let param = {
		// 	t: time,
		// 	n: randomString,
		// 	iv: md5
		// }
		// options.header = { ...options.header, ...param };
		// resolved是返回成功数据，rejected返回错误数据
		return new Promise((resolved, rejected) => {
			options.success = (res) => {
				uni.hideLoading();
				if (res.data.code !== 200 && res.data.code !== 401 && res.data.code !== 410) {
					// 非成功状态码弹窗
					uni.showToast({
						icon: 'none',
						duration: 3000,
						title: `${res.data.message}`
					});
					// 这里可以做一些状态码判断以及操作
					// 返回错误信息 
				} else if (res.data.code == 200) {
					// 请求回来的状态码为200则返回内容
					resolved(res.data)
				} else if (res.data.code == 410) {
					uni.showModal({
						confirmColor: "#a4192e",
						confirmText: "去认证",
						title: '请先进行村民认证',
						success(ts) {
							if (ts.confirm) {
								uni.navigateTo({
									url: '/pages/me/villagerconfir/villagerconfir',
								});
							}
						}
					})
				} else {
					// 用户未登录,弹出提示
					uni.showModal({
						title: '您未登录'
					})
				}
			};
			options.fail = (err) => {
				// 请求失败弹窗 
				uni.hideLoading();
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '网络错误,请稍后再试'
				});
				rejected(err);
			};
			uni.request(options);
		});
	},
}
export default request;