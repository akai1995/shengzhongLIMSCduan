import request from '@/utils/request'

// 样本查询--医生端
export function listByDoctor(data) {
  return request({
    'url': '/hospitalrelated/sampleReceive/listByDoctor',
    'method': 'post',
	data
  })
}
// 查询样本详情
export function sampleDetalis(id) {
    return request({
        url: '/hospitalrelated/sampleReceive/'+id,
        method: 'get'
    })
}
// 扫码获取患者样本信息
export function getSampleByQRCode(data) {
    return request({
        'url': '/hospitalrelated/sampleReceive/getSampleByQRCode',
        'method': 'post',
        data
    })
}
// 批量样本接收
export function batchReceiveSample(params) {
    return request({
        'url': '/hospitalrelated/sampleReceive/batchReceiveSample',
        'method': 'post',
        params
    })
}
// 批量样本送检
export function batchSendSample(params) {
    return request({
        'url': '/hospitalrelated/sampleReceive/batchSendSample',
        'method': 'post',
        params
    })
}