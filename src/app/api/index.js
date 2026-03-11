import { upload } from '@/providers/upload'; import service from '@/app/app.api';

/* 轮播 */ export function swiperList(params) { return service.get({ 'url': '/generalcontent/carousel/carousel/carouselList', params }) } 

/* 获取某个频道的消息列表 */ export function loadHisMsg(params) { return service.post({ 'url': '/im/imapi/message', data: params }) }
/* 同步最近会话 */ /* export function syncConversation(params) { return service.post({ 'url': '/im/im/syncMsg', data: params }) } */
/* 设备列表 */ export function deleteConversion(params) { return service.post({ 'url': '/generalcontent/carousel/carousel/carouselList', data: params }) }
/* 删除某个频道的最近会话 */ export function registerIm() { return service.get({ 'url': '/im/im/registerUser' }) }

/* 页面 上  预警 高温数量  预警低温数量 */ export function getDeviceTemperatureCount(params) { return service.get({ 'url': '/appDevice/storageInstrumentReserve/getDeviceTemperatureCount', params }) }
/* （deviceName, sn ,type[ydg,bx]） */ export function getTemperatureDevice(params) { return service.get({ 'url': '/appDevice/storageInstrumentReserve/getTemperatureDevice', params }) }
/* 温度设备数据曲线 */ export function getRealTimeCurve(sn) { return service.get({ 'url': '/appDevice/storageInstrumentReserve/getRealTimeCurve'+(sn?'?sn='+sn:'') }) }

export function getSignFileList(params) { return service.get({ url: '/appDevice/storageInstrumentReserve/getSignList', params	}) }
export function appSignDataSubmit(data) { return service.post({ url: '/appDevice/storageInstrumentReserve/appSignDataSubmit', data }) }

/* 文件上传 */ export function ocrUploadFile(data) { return upload({ url: '/sys/common/upload', name: data.name, filePath: data.filePath }) }
/** */ export function saveOcrInfo(data) { return service.post({ url: '/appDevice/storageInstrumentReserve/saveOcrInfo', data }) }
/* 删除记录 */ export function delOcrInfo(ids) { return service.post({ url: '/appDevice/storageInstrumentReserve/delOcrInfo', data: { ids } }) }
/* 解析出的内容 */ export function parseDoc(filePath) { return service.get({ url: '/appDevice/storageInstrumentReserve/parseDoc', params: { filePath } }) }
/* 模糊查询使用 */ export function getOcrInfoList(params) { return service.get({ url: '/appDevice/storageInstrumentReserve/getOcrInfoList', params }) }

/** 设备 start */
export function getDeviceList(params) { return service.get({ url: '/appDevice/storageInstrumentReserve/deviceList', params }) }
export function deviceSubmit(data) { return service.post({ url: '/appDevice/storageInstrumentReserve/appDeviceReserveSubmit', data }) }
export function deviceDetail(id) { return service.get({ url: `/appDevice/storageInstrumentReserve/deviceDetailById?instrumentId=${id}` }) }
export function reserveDetail(id) { return service.get({ url: `/appDevice/storageInstrumentReserve/queryById?id=${id}` }) }
export function getReserveList(params) { return service.get({ url: `/appDevice/storageInstrumentReserve/reserveList`, params }) }
export function getAllDayReserve(params) { return service.get({ url: `/appDevice/storageInstrumentReserve/getDeviceReserveTimeV2List`, params }) }
export function getRejectDes(id) { return service.get({ url: `/appDevice/storageInstrumentReserve/queryRejectComment?id=${id}` }) }
export function openDevice(id) { return service.get({ url: `/appDevice/storageInstrumentReserve/powerOn?id=${id}` }) }
export function closeDevice(id) { return service.get({ url: `/appDevice/storageInstrumentReserve/powerOff?id=${id}` }) }
export function getGroup() { return service.get({ url: `/appDevice/storageInstrumentReserve/getParentProjectList` }) }
export function getTeacher(id) { return service.get({ url: `/appDevice/storageInstrumentReserve/getProjectDetList?pid=${id}` }) }
export function setCancelReserve(data) { return service.post({ url: `/appDevice/storageInstrumentReserve/reserveCancel`, data }) }
/** 设备 end */

/** 操作手册 end */
/** 分页查询*/ export function getOperationManualList(pageNum,pageSize) { return service.get({ url:'/personalcenter/operationManual/list', params:{ pageNum, pageSize } }) }
/** 通过id查询 */ export function getOperationManualId(id) { return service.get({ url:`/personalcenter/operationManual/selectId/${id}` }) }
export function getOperationManualType(type) { return service.get({ url:'/personalcenter/operationManual/selectType', params:{ type } }) }
/** 操作手册 end */

/* 发布社区新闻 */ export function publish(data) { return service.post({ url: '/community/communityNews/publish', data }) }
/* 检查图片敏感 */ export function checkImg(url) { return service.get({ url: `/community/communityNews/checkImgUrl?imgUrl=${url}`, }) }
/* 根据条件分类分页查询社区新闻 */ export function newsPage(data) { return service.post({ url: '/community/communityNews/newsPage', data }) }
/* 查询栏目列表 */ export function searchLink() { return service.get({ url: '/community/communityLink/list', }) }
/* 根据id查询详情 */ export function getDetail(id) { return service.get({ url: `/community/communityNews/${id}`, }) }
/* 收藏/取消收藏 */ export function collect(params) { return service.post({ url: '/community/communityCollect/collect', params }) }
/* 点赞/取消点赞 */ export function like(params) { return service.post({ url: '/community/communityLike/like', params }) }
/* 关注/取消关注 */ export function concern(params) { return service.post({ url: '/community/communityConcern/concern', params }) }
/* 获取关注/粉丝数量 */ export function getConcernCount(params) { return service.post({ url: '/community/communityConcern/getConcernCount', params }) }
/* 获取关注列表/粉丝列表 */ export function selectConcernList(params) { return service.post({ url: '/community/communityConcern/select', params }) }
/* 获取关注人发送新闻动态列表 */ export function concernPage(data) { return service.post({ url: '/community/communityConcern/concernPage', data }) }
/* 获取关注列表/粉丝ID列表 */ export function selectConcernIds(params) { return service.post({ url: '/community/communityConcern/selectIds', params }) }
/* 获取关注人发送新闻动态列表 */ export function concernPeoplePage(data) { return service.post({ url: '/community/communityConcern/concernPeoplePage', data }) }
/* 获取我收藏的社区新闻 */ export function collectPage(data) { return service.post({ url: '/community/communityCollect/collectPage', data }) }
/* 获取用户信息（包括点赞数、粉丝数、关注数） */ export function getUserInformation(id) { return service.get({ url: `/community/communityNews/getUser/${id}` }) }
/* 获取评论列表 */ export function getCommentList(data) { return service.post({ url: '/community/communityComment/commentPage', data }) }
/* 新增评论 */ export function addNewsComment(data) { return service.post({ url: '/community/communityComment/add', data }) }
/* 全文检索 */ export function searchKeyWord(params) { return service.post({ url: '/community/communityNews/searchKeyWord', params }) }
/* 删除社区新闻 */ export function deleteCircle(ids) { return service.del({ url: `/community/communityNews/remove/${ids}` }) }
/* 分享 */ export function shareCommunityNews(id) { return service.get({ url: `/community/communityNews/shareNews/${id}` }) }
/* 删除评论 */ export function deleteCommentById(id) { return service.get({ url: `/community/communityComment/remove/${id}` }) }