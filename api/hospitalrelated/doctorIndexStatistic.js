import request from '@/utils/request'

// 近三年送检量
export function getSendAmountForThreeYears(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getSendAmountForThreeYears',
		method: 'get',
	})
}
// 近五年的样本量统计
export function getSampleAmountForFiveYears(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getSampleAmountForFiveYears',
		method: 'get',
	})
}
// 癌种排行
export function getCancerTypeAmount(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getCancerTypeAmount',
		method: 'get',
	})
}
//接收医院-送检医院排名top5
export function getHospitalAmount(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getHospitalAmount',
		method: 'get',
	})
}
//所有医院科室排名top5
export function getDepartmentAmount(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getDepartmentAmount',
		method: 'get',
	})
}

//所有医院项目排名top10
export function getProjectNameAmount(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getProjectNameAmount',
		method: 'get',
	})
}

//本院送检量（地州与省）
export function getSendAmount(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getSendAmount',
		method: 'get',
	})
}

//地州医院-我的送检
export function getMySendAmount(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getMySendAmount',
		method: 'get',
	})
}

//省肿送检量
export function getProvinceSendAmount(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getProvinceSendAmount',
		method: 'get',
	})
}
// 接收医院接收量
export function getReceiveAmountApi(){
	return request({
		url: '/hospitalrelated/doctorIndexStatistic/getReceiveAmount',
		method: 'get',
	})
}