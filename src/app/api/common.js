import upload from '@/providers/upload'
import service from '@/app/app.http';

/* 文件上传 */
export function ocrUploadFile(data) { return upload({ url: '/sys/common/upload', name: data.name, filePath: data.filePath }) }
/** */
export function saveOcrInfo(data) { return service.post({ url: '/appDevice/storageInstrumentReserve/saveOcrInfo', data }) }
/* 删除记录 */
export function delOcrInfo(ids) { return service.post({ url: '/appDevice/storageInstrumentReserve/delOcrInfo', data: { ids } }) }
/* 解析出的内容 */
export function parseDoc(filePath) { return service.get({ url: '/appDevice/storageInstrumentReserve/parseDoc', params: { filePath } }) }
/* 模糊查询使用 */
export function getOcrInfoList(params) { return service.get({ url: '/appDevice/storageInstrumentReserve/getOcrInfoList', params }) }