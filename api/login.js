import request from '@/utils/request'

// 微信登录授权
export function wxLogin(code,phoneCode) {
	const data = {
		code:code,
		phoneCode:phoneCode
	}
	return request({
		'url': '/auth/wxLogin',
		headers: {
			isToken: false
		},
		'method': 'post',
		'data': data
	})
}

// 登录方法
export function login(username, password, code, uuid) {
	const data = {
		username,
		password,
		code,
		uuid
	}
	return request({
		'url': '/auth/login',
		headers: {
			isToken: false
		},
		'method': 'post',
		'data': data
	})
}

// 获取用户详细信息
export function getInfo() {
	return request({
		'url': '/system/user/getInfo',
		'method': 'get'
	})
}

// 获取微信用户详细信息
export function getWxInfo(id) {
	return request({
		'url': '/personalcenter/userInformation/getInfo/' + id,
		'method': 'get'
	})
}

// 退出方法
export function logout() {
	return request({
		'url': '/auth/logout',
		'method': 'delete'
	})
}

// 获取验证码
export function getCodeImg() {
	return request({
		'url': '/code',
		headers: {
			isToken: false
		},
		method: 'get',
		timeout: 20000
	})
}

export function authWebLoginApi(uuid) {
	return request({
		'url': '/auth/authToken/' + uuid,
		method: 'get',
	})
}

// 修改密码
export function editPassWord(data) {
	return request({
		'url': '/auth/resetPassWord',
		'method': 'post',
		'data':data
	})
}