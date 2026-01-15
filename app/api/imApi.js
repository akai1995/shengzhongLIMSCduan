import request from '@/providers/http'

// 获取某个频道的消息列表
export function loadHisMsg(params) {
	return request({
		'url': '/im/imapi/message',
		'method': 'post',
		data: params
	})
}

//同步最近会话
// export function syncConversation(params) {
//   return request({
//     'url': '/im/im/syncMsg',
//     'method': 'post',
// 	 data: params
//   })
// }

//删除某个频道的最近会话
export function deleteConversion(params) {
	return request({
		'url': '/generalcontent/carousel/carousel/carouselList',
		'method': 'post',
		data: params
	})
}


//删除某个频道的最近会话
export function registerIm() {
	return request({
		'url': '/im/im/registerUser',
		'method': 'get'
	})
}