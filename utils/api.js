import request from './request';
/**
 *    登陆请求
 */
export function orderApi(data,hideLoading) {
    data.merchantID=uni.getStorageSync("merchantID")
	return request({
		url: '/orderList',
		method: 'POST',
		data,
        hideLoading
	})
}
export function orderUpdateApi(data) {
	return request({
		url: '/updateOrder',
		method: 'POST',
		data
	})
}
// 添加订单
export function orderAddApi(data,res) {
    data.merchantID=uni.getStorageSync("merchantID")
	return request({
		url: '/addOrder',
		method: 'POST',
		data
	},res)
}
// 删除订单
export function orderDeleteApi(data) {
    return request({
        url: '/orderDelete',
        method: 'POST',
        data
    })
}

// 登录
export function loginApi(data) {
    return request({
        url: '/login',
        method: 'POST',
        data
    })
}
// 获取菜单
export function menuApi(data) {
    data.merchantID=uni.getStorageSync("merchantID")
    return request({
        url: '/getMenu',
        method: 'POST',
        data
    })
}
// 删除菜单
export function deleteMenuApi(data) {
    return request({
        url: '/deleteMenu',
        method: 'POST',
        data
    })
}
// 添加菜单
export function addMenuApi(data) {
    data.merchantID=uni.getStorageSync("merchantID")
    return request({
        url: '/addMenu',
        method: 'POST',
        data
    })
}
// 修改菜单
export function updateMenuApi(data) {
    return request({
        url: '/updateMenu',
        method: 'POST',
        data
    })
}
//验证token是否过期
export function authTokenApi(data) {
    return request({
        url: '/authToken',
        method: 'POST',
        data
    })
}
//添加菜品
export function addFoodsApi(data) {
    return request({
        url: '/addFoods',
        method: 'POST',
        data
    })
}
//添加记录
export function addRecordsApi(data) {
    return request({
        url: '/recordsList',
        method: 'POST',
        data
    })
}
//添加记录
export function updateRecordsApi(data) {
    return request({
        url: '/updateOneRecord',
        method: 'POST',
        data
    })
}
//统计数据
export function chartBarApi(data) {
    data.merchantID=uni.getStorageSync("merchantID")
    return request({
        url: '/chartBar',
        method: 'POST',
        data
    })
}
//设置订单一键完成
export function setFinishApi(data) {
    data={merchantID:uni.getStorageSync("merchantID")}
    return request({
        url: '/oneKeyFinish',
        method: 'POST',
        data
    })
}
//获取用户信息
export function userInfoApi(data) {
       return request({
        url: '/userinfo',
        method: 'POST',
        data
    })
}
//获取订单二维码
export function qrCodeApi(data) {
    return request({
        url: '/qrCode',
        method: 'POST',
        data
    })
}
//生成二维码
export function addQrCodeApi(data) {
    data.merchantID=uni.getStorageSync("merchantID")
    return request({
        url: '/addQrCode',
        method: 'POST',
        data
    })
}
//生成订单图片
export function orderImgApi(data) {
    return request({
        url: '/orderImg',
        method: 'POST',
        data
    })
}
// 添加账号
export function addAccountApi(data) {
    return request({
        url: '/addAccount',
        method: 'POST',
        data
    })
}
// 获取账号列表
export function getAccountApi(data) {
    return request({
        url: '/getAccount',
        method: 'POST',
        data
    })
}
// 修改
export function editAccountApi(data) {
    return request({
        url: '/editAccount',
        method: 'POST',
        data
    })
}
//检查订单状态
export function checkOrderStatusApi(data) {
    return request({
        url: '/checkOrderStatus',
        method: 'POST',
        data
    })
}
//获取文章列表
export function articleListApi(data) {   
    return request({
        url: '/articleList',
        method: 'POST',
        data
    })
}
//添加文章
export function addArticleApi(data) {   
    return request({
        url: '/addArticle',
        method: 'POST',
        data
    })
}