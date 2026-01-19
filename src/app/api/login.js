import service from '@/app/app.http';

// 微信登录授权
export function wxLogin(code, phoneCode) {
	return service.post({ 'url': '/sys/wxLogin', headers: { isToken: false }, data: { code, phoneCode } })
}

// 登录方法
export function login(username, password, code, uuid) {
	return service.post({ 'url': '/auth/login', headers: { isToken: false }, data: { username, password, code, uuid } })
}

// 获取用户详细信息
export function getInfo() {
	return service.get({ 'url': '/system/user/getInfo' })
}

// 获取微信用户详细信息
export function getWxInfo(id) {
	return service.get({ 'url': '/personalcenter/userInformation/getInfo/' + id })
}

// 退出方法
export function logout() {
	return service.del({ 'url': '/auth/logout' })
}

// 获取验证码
export function getCodeImg() {
	return service.get({ 'url': '/code', headers: { isToken: false }, timeout: 20000 })
}

export function authWebLoginApi(uuid) {
	return service.get({ 'url': '/auth/authToken/' + uuid })
}

// 修改密码
export function editPassWord(data) {
	return service.post({ 'url': '/auth/resetPassWord', data })
}