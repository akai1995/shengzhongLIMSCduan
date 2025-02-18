import request from '@/utils/request'

// 报告查看信息
export function selectPersonalList(data) {
  return request({
    'url': '/hospitalrelated/reportInformation/selectPersonalList',
    'method': 'post',
	data
  })
}

// 报告查看信息详情
export function selectPersonalDetails(id) {
  return request({
    'url': '/hospitalrelated/reportInformation/'+id,
    'method': 'get',
  })
}

//获取报告
export function getReportInfo(data) {
  return request({
    'url': '/hospitalrelated/reportInformation/getReportInfo',
    'method': 'post',
	data
  })
}

//报告解读 分页
export function reportAnalysislist(data) {
  return request({
    'url': '/hospitalrelated/reportAnalysisApply/list',
    'method': 'post',
	data
  })
}
//报告解读列表-所有
export function selectReportApplyForDoctor(params) {
  return request({
    'url': '/hospitalrelated/reportAnalysisApply/list/selectReportApplyForDoctor',
    'method': 'get',
    params
  })
}

//报告解读 详情
export function reportAnalysisDetalis(id) {
  return request({
    'url': '/hospitalrelated/reportAnalysisApply/'+id,
    'method': 'post',
  })
}

//报告解读申请
export function checkedAuthList(data) {
  return request({
    'url': '/hospitalrelated/reportInformation/checkedAuthList',
    'method': 'post',
	data
  })
}

//报告解读申请-照片上传报告
export function reportAnalysisApplyByPhoto(data) {
  return request({
    'url': '/hospitalrelated/reportAnalysisApply/reportAnalysisApplyByPhoto',
    'method': 'post',
	data
  })
}

//报告解读申请-通过系统已有报告
export function reportAnalysisApplyByReport(data) {
  return request({
    'url': '/hospitalrelated/reportAnalysisApply/reportAnalysisApplyByReport',
    'method': 'post',
	data
  })
}

// 查看所有报告-可根据条件筛选（医生端）
export function selectHospitalReportList(params) {
  return request({
    'url': '/hospitalrelated/reportInformation/selectHospitalReportList',
    'method': 'get',
    params
  })
}

// 医生解读报告
export function analysis(data) {
  return request({
    'url': '/hospitalrelated/doctorAnalysis/analysis',
    'method': 'post',
    data
  })
}

// 据applyCode获取报告
export function selectApplyCode(code) {
  return request({
    'url': '/hospitalrelated/reportInformation/selectApplyCode/'+code,
    'method': 'get',
  })
}

// 授权报告
export function authReportInfo(data) {
  return request({
    'url': '/hospitalrelated/reportInformation/authReportInfo',
    'method': 'post',
	 data:data
  })
}