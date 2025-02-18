import request from '@/utils/request'

// 登记筛查用户
export function screeninguserReg(data) {
	return request({
		url: '/hospitalrelated/screeninguser/register',
		method: 'post',
		data
	})
}
// 结果上传
export function uploadresult(data) {
	return request({
		url: '/hospitalrelated/screeninguserkit/uploadresult',
		method: 'post',
		data
	})
}
// 分页查询用户领取得试剂盒
export function pageUserKit(data) {
	return request({
		url: '/hospitalrelated/screeninguserkit/pageUserKit',
		method: 'post',
		data
	})
}
// 分页查询用户信息
export function getScreeningUserById(id) {
	return request({
		url: `/hospitalrelated/screeninguser/getScreeningUserById/${id}`,
		method: 'get',
	})
}
// 发放试剂盒
export function pushBoxApi(data) {
	return request({
		url: `/hospitalrelated/screeninguserkit/giveout`,
		method: 'post',
		data
	})
}
// 查询当前用户登记的筛查用户
export function getScreeningUserInfo() {
	return request({
		url: `/hospitalrelated/screeninguser/getScreeningUserInfo`,
		method: 'get'
	})
}
// 删除试剂盒
// 发放试剂盒
export function deleteKit(data) {
	return request({
		url: `/hospitalrelated/screeninguserkit/deleteKit`,
		method: 'post',
		data
	})
}


// 早筛单位
export function getScreeningCompanyList(cityCode) {
  return request({
    url: '/hospitalrelated/screeningCompany/list/'+cityCode,
    method: 'get',
  })
}