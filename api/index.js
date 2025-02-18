import request from '@/utils/request'

// 轮播
export function swiperList(params) {
  return request({
    'url': '/generalcontent/carousel/carousel/carouselList',
    'method': 'get',
	params
  })
}