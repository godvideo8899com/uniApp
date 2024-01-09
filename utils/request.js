import {getToken,removeToken} from '../utils/auth';
import env from '@/utils/env';
function service(options = {},resFlag) {
    if (options.data) {
        // 循环遍历 params 对象的属性
        for (const key in options.data) {
          // 检查属性值是否为空（null、undefined 或空字符串）
          if (
            options.data[key] === null ||
            options.data[key] === undefined ||
            options.data[key] === ""
          ) {
            // 如果为空，从 params 对象中删除该属性
            delete options.data[key];
          }
        }
      }
	options.url = `${env.baseUrl}${options.url}`;
    console.log(env.baseUrl);
	// 判断本地是否存在token，如果存在则带上请求头
	if (getToken()) {
		options.header = {
			'content-type': 'application/json',
			'Authorization': `Bearer ${getToken()}`	// 这里是token(可自行修改)
		};
	}
	if(!options.hideLoading){
		uni.showLoading({
			title: "加载中",
			mask: true,
		  });
	}
		
    
	return new Promise((resolved, rejected) => {
		options.success = (res) => {
            console.log(res);
			// 如果请求回来的状态码不是200则执行以下操作
            uni.hideLoading()
			if (res.data.code != 1) {
				// 非成功状态码弹窗
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: `${res.data.msg}`
				});
				// 登陆失效
				if (res.data.code == 401) {
					// 清除本地token
					removeToken()
					// 关闭所有页面返回到登录页
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
				// 返回错误信息
				rejected(res)
			} else {
				// 请求回来的状态码为200则返回内容
                
				resolved(resFlag?res.data:res.data.data)
			}
		};
		options.fail = (err) => {
			// 请求失败弹窗
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '服务器错误,请稍后再试'
			});
            uni.hideLoading()
			rejected(err);
		};
        
		uni.request(options);
	});
}

export default service;