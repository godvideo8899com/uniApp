import request from './request';
/**
 *    登陆请求
 */
export function orderApi(data) {
	return request({
		url: '/orderList',
		method: 'POST',
		data
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
    return request({
        url: '/chartBar',
        method: 'POST',
        data
    })
}
//设置订单一键完成
export function setFinishApi(data) {
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
    return request({
        url: '/addQrCode',
        method: 'POST',
        data
    })
}
