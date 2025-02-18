import request from '@/utils/request'

// C端获取专家列表
export function getZjListApi(data) {
	return request({
		url: '/generalcontent/expert/pageExpert',
		method: 'post',
		data
	})
}
// C端获取我是医生
export function getZjListApi1(data) {
	return request({
		url: '/generalcontent/expert/pageExpert2',
		method: 'post',
		data
	})
}

// 根据专家id查询专家详情
export function getZjDetailApi(id) {
	return request({
		url: `/generalcontent/expert/see/${id}`,
		method: 'get',
	})
}
// C端-患者发起咨询
export function createConsultationApi(data) {
	return request({
		url: '/generalcontent/expertconsultation/createConsultation',
		method: 'post',
		data
	})
}
// C端-修改咨询
export function editConsultationApi(data) {
	return request({
		url: '/generalcontent/expertconsultation/editConsultation',
		method: 'post',
		data
	})
}
// C端 我的咨询
export function pageAskApi (data) {
	return request({
		url: '/generalcontent/expertconsultation/pageAsk',
		method: 'post',
		data
	})
}
// C端-患者查询我发起的咨询
export function pageConsultationApi (data) {
	return request({
		url: '/generalcontent/expertconsultation/pageConsultation',
		method: 'post',
		data
	})
}
// 
export function getItemById (id) {
	return request({
		url: `/generalcontent/expertconsultation/getById/${id}`,
		method: 'post'
	})
}