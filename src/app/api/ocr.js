import upload from '@/providers/utilities/upload'
import service from '@/app/app.http';

/**
 * 文件上传
 * @param {*} file 
 * @returns 
 */
export function ocrUploadFile(data) {
    return upload({ url: '/sys/oss/file/upload', name: data.name, filePath: data.filePath })
}

/**
 * 
 * @param {*} title 文件名称
 * @param {*} filePath 文件地址
 * @param {*} content  解析出的内容
 * @returns 
 */
export function saveOcrInfo(data) {
    return service.post({ url: '/appDevice/storageInstrumentReserve/saveOcrInfo', data })
}

/**
 * 解析出的内容
 * @param {*} filePath 
 * @returns 
 */
export function parseDoc(filePath) {
    return service.get({ url: '/appDevice/storageInstrumentReserve/parseDoc', params: {filePath} })
}

/**
 * 模糊查询使用
 * @param {*} params 
 * @returns 
 */
export function getOcrInfoList(params) {
    return service.get({ url: '/appDevice/storageInstrumentReserve/getOcrInfoList', params })
}