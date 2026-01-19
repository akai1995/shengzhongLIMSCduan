import service from '@/app/app.http';

// 轮播
export function swiperList(params) {
  return service.get({ 'url': '/generalcontent/carousel/carousel/carouselList', params })
}