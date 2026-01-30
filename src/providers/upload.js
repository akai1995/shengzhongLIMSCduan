import config from '@/app/app.config'; import store from '@/store';
import { onToast, onShowConfirm, tansParams } from '@/providers/index'
import httpStatusCode from '@/providers/utilities/httpStatusCode'
import { getToken } from '@/providers/storage'

let timeout = 10000
const baseUrl = config.baseUrl

export default upload = config => {
  /* 是否需要设置 token */
  const isToken = (config.headers || {}).isToken === false; config.header = config.header || { }
  if ((store.getters.token || getToken()) && !isToken) { config.header['X-Access-Token'] = store.getters.token || getToken() }
  config.header['accept-language'] = 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
  /* config.header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8' */

  /* get请求映射params参数 */
  if (config.params) { let url = config.url + '?' + tansParams(config.params); url = url.slice(0, -1); config.url = url }
  return new Promise((resolve, reject) => {
      uni.uploadFile({
        timeout: config.timeout || timeout, url: `${baseUrl}${config.url||'/sys/common/upload'}`,
        files: config.files?config.files:[{uri:config.filePath}], filePath: config.filePath, name: config.name || 'file',
        formData: config.formData||{ biz: 'temp' }, header: config.header,
        success: (res) => {
            const result = JSON.parse(res.data); const code = result.code || 200;
            const msg = httpStatusCode[code] || result.message || httpStatusCode['default']
            if (code === 200) { resolve(result) } else if (code == 401) {
                onShowConfirm("登录状态已过期，您可以继续留在该页面，或者重新登录?").then(res => {
                    if (res.confirm) {
                        store.dispatch('LogOut').then(res => {
                            uni.reLaunch({ url: '/sub-pack/project-pages/login/login' })
                        })
                    }
                })
                reject('无效的会话，或者会话已过期，请重新登录。')
            } 
            else if (code === 500) { onToast(msg); reject('500') } else { onToast(msg); reject(code) }
        },
        fail: (error) => {
            console.error('error', error); const { message, errMsg } = error
            if (typeof message=='string') {
                if (message === 'Network Error') { message = '后端接口连接异常' } else if (message.includes('timeout')) { message = '系统接口请求超时' }
                else if (message.includes('Request failed with status code')) { message = '系统接口' + message.substr(message.length - 3) + '异常' }
                onToast(message); reject(message)
            } else if (typeof errMsg=='string') { console.log('errMsg', errMsg); onToast(errMsg); reject(errMsg) } 
            else { onToast('异常'); reject(error) }
        }
      })
  })
}

/**
 * 获取文件扩展名，可控制大小写
 * @param {string} filename - 文件名
 * @param {boolean} toUpperCase - 是否转换为大写，默认false（小写）
 * @returns {string} 文件扩展名，无扩展名时返回空字符串
 */
export function getFileExt(filename, toUpperCase = true) {
  /* 1. 判空和类型检查 */ if (!filename || typeof filename !== 'string') { console.warn('文件名必须是有效的字符串'); return ''; }  
  /* 2. 去除首尾空格 */ const trimmedName = filename.trim();  
  /* 3. 空字符串检查 */ if (trimmedName.length === 0) { return ''; }  
  /* 4. 查找最后一个点号 */ const lastDotIndex = trimmedName.lastIndexOf('.');  
  /* 5. 检查点号位置 */ if (lastDotIndex === -1 ||    lastDotIndex === 0 ||    lastDotIndex === trimmedName.length - 1) { return ''; }  
  /* 6. 提取扩展名 */ const extension = trimmedName.slice(lastDotIndex + 1);  
  /* 7. 根据参数控制大小写 */ return toUpperCase ? extension.toUpperCase() : extension.toLowerCase();
}

/**
 * 增强版（处理边缘情况）
 * @param {number} bytes - 文件大小
 * @param {number} decimals - 文件名
 */
export function formatFileSize(bytes, decimals = 2) {
  /* 输入验证 */ if (typeof bytes !== 'number' || !isFinite(bytes) || bytes < 0) { return '0 B'; }  
  if (bytes === 0) { return '0 B'; } const k = 1024; const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];  
  /* 对于小于1KB的情况特殊处理 */ if (bytes < k) { return bytes + ' B'; }  
  /* 计算单位 */ const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1); const size = bytes / Math.pow(k, i);  
  /* 判断是否为整数（考虑浮点数精度问题） */ const isInteger = Math.abs(size - Math.round(size)) < 0.00001;  
  if (isInteger) { return Math.round(size) + ' ' + units[i]; }
  else { /* 非整数时保留指定小数位 */ return size.toFixed(decimals) + ' ' + units[i]; }
}

function pickExclude(obj, keys) { if (!['[object Object]', '[object File]'].includes(Object.prototype.toString.call(obj))) { return {} } return Object.keys(obj).reduce((prev, key) => { if (!keys.includes(key)) { prev[key] = obj[key] } return prev }, {}) }

function formatImage(res) {
    return res.tempFiles.map((item) => ({
        ...pickExclude(item, ['path']), type: 'image', url: item.path, thumb: item.path, size: item.size, summaryName: `${getFileExt(item.path)} ${formatFileSize(item.size)}`,
		// #ifdef H5
		name: item.name
		// #endif
    }))
}

function formatVideo(res) {
    return [
        {
            ...pickExclude(res, ['tempFilePath', 'thumbTempFilePath', 'errMsg']), type: 'video', url: res.tempFilePath, thumb: res.thumbTempFilePath, size: res.size, summaryName: `${getFileExt(item.thumbTempFilePath)} ${formatFileSize(item.size)}`,
			// #ifdef H5
			name: res.name
			// #endif
        }
    ]
}

function formatMedia(res) {
    const { tempFiles, type } = res
    return tempFiles.map((item) => {
        const thumb = type === 'video' ? item.thumbTempFilePath : item.tempFilePath;
        return ({ ...pickExclude(item, ['fileType', 'thumbTempFilePath', 'tempFilePath']), type: type, thumb, size: item.size, name: thumb.slice(thumb.lastIndexOf('/')+1, thumb.length), summaryName: `${getFileExt(thumb)} ${formatFileSize(item.size)}` })
    })
}

function formatFile(res) {
    const { tempFiles } = res
    return tempFiles.map((item) => ({
        ...pickExclude(item, ['path']), thumb: item.path,  size:item.size, name: item.path.slice(item.path.lastIndexOf('/')+1, item.path.length), summaryName: `${getFileExt(item.path)} ${formatFileSize(item.size)}`,
		// #ifdef H5
		name: item.name, type: item.type
		// #endif 
	}))
}

const imgDocExt = ['.tif','.pjp','.jfif','.ico','.tiff','.gif','.svg','.xbm','.jxl','.jpeg','.svgz','.jpg','.webp','.png','.bmp','.pjpeg','.avif','.doc','.docx','.txt','.pdf','.csv','.tsv','.xls','.xlsx','.xlsm','.ppt','.pptx']

/**
 * 
 * @param {string}  accept      image media video file message-image message-file
 * @param {string}  mediaType  ['image','video','mix']
 * @param {boolean} multiple
 * @param {string}  capture    ['camera','album']
 * @param {string}  mediaType  ['image','video','mix'] 
 * @returns 
 */
export function onChooseFile(fileObj) {
    const { accept, mediaType, multiple, capture, compressed, maxDuration, sizeType, camera, maxCount } = fileObj
    return new Promise((resolve, reject) => {
        switch (accept) {
            case 'image':
                uni.chooseImage({ count: multiple ? Math.min(maxCount, 9) : 1, mediaType:mediaType||['image'],sourceType: capture, sizeType, success: (res) => resolve(formatImage(res)), fail: reject })
                break
                // #ifdef MP-WEIXIN
            case 'media':
                wx.chooseMedia({ count: multiple ? Math.min(maxCount, 9) : 1, mediaType:mediaType||['image'], sourceType: capture, maxDuration, sizeType, camera, success: (res) => resolve(formatMedia(res)), fail: reject })
                break
                // #endif
            case 'video':
                uni.chooseVideo({ sourceType: capture, compressed, maxDuration, camera, success: (res) => resolve(formatVideo(res)), fail: reject })
                break
                // #ifdef MP-WEIXIN || H5
            case 'message-image':
                // #ifdef MP-WEIXIN
                wx.chooseMessageFile({ count: multiple ? maxCount : 1, type: 'image', success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
                // #ifdef H5
                uni.onChooseFile({ count: multiple ? maxCount : 1, type: 'image', success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
                break
            case 'message-file':
                // #ifdef MP-WEIXIN
                wx.chooseMessageFile({ count: multiple ? maxCount : 1, type: 'file', success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
                // #ifdef H5
                uni.onChooseFile({ count: multiple ? maxCount : 1, extension: ['.doc','.docx','.txt','.pdf','.csv','.tsv','.xls','.xlsx','.xlsm','.ppt','.pptx'], success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
                break
            case 'file':
                // #ifdef MP-WEIXIN
                wx.chooseMessageFile({ count: multiple ? maxCount : 1, /* type: accept, */ extension: imgDocExt, success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
                // #ifdef H5
                uni.onChooseFile({ count: multiple ? maxCount : 1, /* type: accept, */ extension: imgDocExt, success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
                break
                // #endif
            default: 
                // #ifdef MP-WEIXIN
                wx.chooseMessageFile({ count: multiple ? maxCount : 1, /* type: 'all', */ extension: imgDocExt, success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
                // #ifdef H5
                uni.onChooseFile({ count: multiple ? maxCount : 1, /* type: 'all', */ extension: imgDocExt, success: (res) => resolve(formatFile(res)), fail: reject })
                // #endif
        }
    })
}
