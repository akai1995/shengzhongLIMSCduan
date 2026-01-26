import service from '@/app/app.http';

/* 获取某个频道的消息列表 */
export function loadHisMsg(params) { return service.post({ 'url': '/im/imapi/message', data: params }) }
/* 同步最近会话 */
// export function syncConversation(params) { return service.post({ 'url': '/im/im/syncMsg', data: params }) }
/* 删除某个频道的最近会话 */
export function deleteConversion(params) { return service.post({ 'url': '/generalcontent/carousel/carousel/carouselList', data: params }) }
/* 删除某个频道的最近会话 */
export function registerIm() { return service.get({ 'url': '/im/im/registerUser' }) }