
// 认证令牌
export function getToken() {
	return uni.getStorageSync('token')
}

export function setToken(token) {
	return uni.setStorageSync('token', token)
}

export function removeToken() {
	return uni.removeStorageSync('token')
}