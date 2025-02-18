import request from '@/utils/request'


// 订单列表
export function sendOrderList(data) {
  return request({
    url: '/hospitalrelated/sendOrder/sendList',
    method: 'post',
    data
  })
}


// 订单详情
export function sendOrderDetails(id) {
  return request({
    url: '/hospitalrelated/sendOrder/order/'+id,
    method: 'get',
  })
}

// 确认订单
export function confirmOrder(id) {
  return request({
    url: '/hospitalrelated/sendOrder/confirmOrder/'+id,
    method: 'get',
  })
}

// 寄送订单
export function sendOrder(id,deviceId) {
  return request({
    url: '/hospitalrelated/sendOrder/sendOrder/'+id+'/'+ deviceId,
    method: 'get',
  })
}

// 获取订单样本轨迹
export function sample(id) {
  return request({
    url: '/hospitalrelated/sendOrder/sample/'+id,
    method: 'get',
  })
}

// 订单号获取订单详情
export function orderSn(id) {
  return request({
    url: '/hospitalrelated/sendOrder/orderSn/'+id,
    method: 'get',
  })
}

// 样本接收列表
export function receiveList(data) {
  return request({
    url: '/hospitalrelated/sendOrder/receiveList',
    method: 'post',
	data
  })
}

// 接收订单
export function receiveOrder(id) {
  return request({
    url: '/hospitalrelated/sendOrder/receiveOrder/'+id,
    method: 'get',
  })
}
// 填写费用
export function fillFee(data) {
  return request({
    url: '/hospitalrelated/sendOrder/fillFee',
    method: 'post',
	data
  })
}
// 查询默认费用
export function getByOrgIdAndType(data) {
  return request({
    url: '/hospitalrelated/sendFee/getByOrgIdAndType',
    method: 'get',
	data
  })
}