import request from '@/utils/request'

//新增用户信息
export function addPcrInFormation(pcrInformation){
	return request({
		url: '/hospitalrelated/pcrInformation/add',
		method: 'post',
		data: pcrInformation
	})
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

//添加送检预约
export function addInspectionAppointment(inspectionAppointmentVo) {
  return request({
    url: '/hospitalrelated/inspectionAppointment/add',
    method: 'post',
	data:inspectionAppointmentVo
  })
}

//查询送检预约
export function getByIdInspectionAppointment(userId) {
  return request({
    'url': '/hospitalrelated/inspectionAppointment/listId',
     method: 'post',
	params: {userId}
  })
}

//查询送检预约
export function getById(id) {
  return request({
    'url': '/hospitalrelated/inspectionAppointment/selecttById',
    method: 'post',
	params: {id}
  })
}


//添加地址
export function addAddress(inspectionAddressVo) {
  return request({
    url: '/hospitalrelated/inspectioAddress/save',
    method: 'post',
	data: inspectionAddressVo
  })
}
//查询用户的地址
export function getAddres(userId) {
  return request({
    'url': '/hospitalrelated/inspectioAddress/getByIdList',
    method: 'post',
	params: {userId}
  })
}

//修改送检地址
export function updateInspectionAddress(inspectionAddressVo) {
  return request({
    url: '/hospitalrelated/inspectioAddress/update',
    method: 'post',
	data: inspectionAddressVo
  })
}

//批量删除送检地址
export function deleteInspectionAddress(ids) {
  return request({
    url: '/hospitalrelated/inspectioAddress/delete',
    method: 'post',
	params: {ids}
  })
}

//查询单个地址
export function selectOne(id){
  return request({
    url: '/hospitalrelated/inspectioAddress/getId',
    method: 'post',
	params: {id}
  })
}

//历史检测登记
export function selectList(userId){
  return request({
    url: '/hospitalrelated/pcrInformation/getId',
    method: 'post',
	params: {userId}
  })
}	

//查询是否有默认送检地址
export function selectDefaultAddress(userId,defalutAddrsType){
  return request({
    url: '/hospitalrelated/inspectioAddress/getDefaultAddress',
    method: 'post',
	params: {userId,defalutAddrsType}
  })
}


//查询是否有默认寄件地址
export function getDefaultSendAddress(userId){
  return request({
    url: '/hospitalrelated/inspectioAddress/getDefaultSendAddress',
    method: 'post',
	params: {userId}
  })
}
//查询 所有的默认的地址

export function getDefaultAddressList(userId){
  return request({
    url: '/hospitalrelated/inspectioAddress/getDefaultAddressList',
    method: 'post',
	params: {userId}
  })
}


//查询检测项目
export function getProjectList(){
  return request({
    url: '/hospitalrelated/projectTemplate/getProjectList',
    method: 'post',

  })
}

//新增报告订单
export function sendReport(addDTO){
  return request({
    url: '/hospitalrelated/hosreportsendorder/add',
    method: 'post',
    data: addDTO
  })
}
//获取未寄送的报告列表
export function getNoPost(){
  return request({
    url: '/hospitalrelated/reportInformation/listNotSent',
    method: 'get',
  })
}