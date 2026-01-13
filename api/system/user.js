import upload from '@/providers/utilities/upload'
import request from '@/providers/request'

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
	const data = {
		oldPassword,
		newPassword
	}
	return request({
		url: '/system/user/profile/updatePwd',
		method: 'put',
		params: data
	})
}

// 查询用户个人信息
export function getUserProfile() {
	return request({
		url: '/system/user/profile',
		method: 'get'
	})
}

// 修改用户个人信息
export function updateUserProfile(data) {
	return request({
		url: '/system/user/profile',
		method: 'put',
		data: data
	})
}

// 用户头像上传
export function uploadAvatar(data) {
	return upload({
		url: '/system/user/profile/avatar',
		name: data.name,
		filePath: data.filePath
	})
}

// 消息
export function getUserMessageList(data) {
	return request({
		url: '/personalcenter/userMessage/getUserMessageList',
		method: 'post',
		data
	})
}

// 消息 内容
export function getMessageSon(params) {
	return request({
		url: '/personalcenter/userMessage/getMessageSon',
		method: 'post',
		params:params
	})
}

// 消息 内容
export function updateMessageSon(params) {
	return request({
		url: '/personalcenter/userMessage/updateMessageSon',
		method: 'post',
		params:params
	})
}

// 根据用户id获取用户
export function getUserInformation(id) {
	return request({
		url: '/personalcenter/userInformation/getUserInformation/'+id,
		method: 'get',
	})
}

// 查询消息(专家咨询)
export function getUserMessage(params) {
	return request({
		url: '/personalcenter/userMessage/getUserMessage',
		method: 'post',
		params:params
	})
}


//查询医院机构
export function nosocomiumlist() {
	return request({
		url: '/hospitalrelated/hosorgkey/listAll',
		method: 'get',
	})
}


//字典数据
export function dict(type) {
	return request({
		url: '/system/dict/data/type/'+type,
		method: 'get',
	})
}

//添加专家
export function expertAdd(data) {
	return request({
		url: '/generalcontent/expert/add',
		method: 'post',
		data:data
	})
}
//添加专家
export function expertEdit(data) {
	return request({
		url: '/generalcontent/expert/edit',
		method: 'put',
		data:data
	})
}

//根据userId获取专家信息
export function getExpert(id) {
	return request({
		url: '/generalcontent/expert/getExpert/'+id,
		method: 'get',
	})
}

//获取当前用户的专家信息
export function getMyInfo() {
	return request({
		url: '/generalcontent/expert/getMyInfo',
		method: 'get',
	})
}

//医生自己修改信息
export function editExpoert(data) {
	return request({
		url: '/generalcontent/expert/editExpoert',
		method: 'post',
		data
	})
}

//查询医院信息
export function getOrgName(id) {
	return request({
		url: '/hospitalrelated/hospitalConf/getOrgName/'+id,
		method: 'get',
	})
}

//发送重置密码验证码
export function sendPwdChageCode(phone) {
	return request({
		url: '/personalcenter/userInformation/sendPwdChageCode/'+phone,
		method: 'get',
	})
}

//重置密码
export function resetpwd(data) {
	return request({
		url: '/personalcenter/userInformation/resetpwd',
		method: 'post',
		data
	})
}

