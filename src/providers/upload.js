import store from '@/store'; import config from '@/app/app.config'
import { toast, showConfirm, tansParams } from '@/providers/index'
import errorCode from '@/providers/utilities/errorCode'
import { getToken } from '@/providers/auth'

let timeout = 10000
const baseUrl = config.baseUrl
const upload = config => {
  /* 是否需要设置 token */
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || { }
  if (getToken() && !isToken) { config.header['X-Access-Token'] = getToken() }
  config.header['accept-language'] = 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
  /* config.header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8' */

  /* get请求映射params参数 */
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1); config.url = url
  }
  return new Promise((resolve, reject) => {
      uni.uploadFile({
        timeout: config.timeout || timeout,
        url: `${baseUrl}${config.url||'/sys/common/upload'}`,
        files: config.files?config.files:[{uri:config.filePath}],
        filePath: config.filePath,
        name: config.name || 'file',
        formData: config.formData||{ biz: 'temp' },
        header: config.header,
        success: (res) => {
          const result = JSON.parse(res.data); const code = result.success || 200;
          const msg = errorCode[code] || result.message || errorCode['default']
          if (result.success || code === 200) {
            resolve(result)
          } else if (code == 401) {
            showConfirm("登录状态已过期，您可以继续留在该页面，或者重新登录?").then(res => {
                if (res.confirm) { 
                    store.dispatch('LogOut').then(res => { 
                        uni.reLaunch({ url: '/sub-pack/project-pages/login/login' }) 
                    }) 
                }
            })
            reject('无效的会话，或者会话已过期，请重新登录。')
          } else if (code === 500) {
            toast(msg); reject('500')
          } else {
            toast(msg); reject(code)
          }
        },
        fail: (error) => {
            console.error('error', error)
            const { message, errMsg } = error
            if (typeof message=='string') {
                if (message === 'Network Error') {
                    message = '后端接口连接异常'
                } else if (message.includes('timeout')) {
                    message = '系统接口请求超时'
                } else if (message.includes('Request failed with status code')) {
                    message = '系统接口' + message.substr(message.length - 3) + '异常'
                }
                toast(message); reject(message)
            } else if (typeof errMsg=='string') {
                console.log('errMsg', errMsg)
                toast(errMsg); reject(errMsg)
            } else {
                toast('异常')
                reject(error)
            }
        }
      })
  })
}

export default upload

function pickExclude(obj, keys) {
	// 某些情况下，type可能会为
    if (!['[object Object]', '[object File]'].includes(Object.prototype.toString.call(obj))) { return {} }
    return Object.keys(obj).reduce((prev, key) => {
        if (!keys.includes(key)) { prev[key] = obj[key] }
        return prev
    }, {})
}

function formatImage(res) {
    return res.tempFiles.map((item) => ({
        ...pickExclude(item, ['path']), type: 'image',
        url: item.path, thumb: item.path, size: item.size,
		// #ifdef H5
		name: item.name
		// #endif
    }))
}

function formatVideo(res) {
    return [
        {
            ...pickExclude(res, ['tempFilePath', 'thumbTempFilePath', 'errMsg']),
            type: 'video', url: res.tempFilePath, thumb: res.thumbTempFilePath, size: res.size,
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
        return ({
            /* ...item, */ ...pickExclude(item, ['fileType', 'thumbTempFilePath', 'tempFilePath']),
            type: type, thumb, size: item.size, name: thumb.slice(thumb.lastIndexOf('/')+1, thumb.length),
        })
    })
}

function formatFile(res) {
    console.log('formatFile res:',res)
    const { tempFiles } = res
    return tempFiles.map((item) => ({
        // ...item,
        ...pickExclude(item, ['path']), 
		thumb: item.path,  size:item.size,
        name: item.path.slice(item.path.lastIndexOf('/')+1, item.path.length),
		// #ifdef H5
		name: item.name, type: item.type
		// #endif 
	}))
}

/**
 * 
 * @param {string} accept  image media video file
 * @param {string} mediaType  image	只能拍摄图片或从相册选择图片
 *                 video	只能拍摄视频或从相册选择视频
 *                 mix	可同时选择图片和视频
 * @param {boolean} multiple  image media video file
 * @param {string} capture  ['camera','album']
 * @param {string} mediaType  ['image','video','mix'] 
 *                  image	只能拍摄图片或从相册选择图片
 *                  video	只能拍摄视频或从相册选择视频
 *                  mix	可同时选择图片和视频
 * @returns 
 */
export function onChooseFile(fileObj) {
    const { accept, mediaType, multiple, capture, compressed, maxDuration, sizeType, camera, maxCount } = fileObj
    return new Promise((resolve, reject) => {
        switch (accept) {
            case 'image':
                uni.chooseImage({
                    count: multiple ? Math.min(maxCount, 9) : 1,
                    mediaType:mediaType||['image'],sourceType: capture, sizeType,
                    success: (res) => resolve(formatImage(res)),
                    fail: reject
                })
                break
                // #ifdef MP-WEIXIN
                // 只有微信小程序才支持chooseMedia接口
            case 'media':
                wx.chooseMedia({
                    count: multiple ? Math.min(maxCount, 9) : 1,
                    mediaType:mediaType||['image'],
                    sourceType: capture, maxDuration, sizeType, camera,
                    success: (res) => resolve(formatMedia(res)),
                    fail: reject
                })
                break
                // #endif
            case 'video':
                uni.chooseVideo({
                    sourceType: capture, compressed,
                    maxDuration, camera,
                    success: (res) => resolve(formatVideo(res)),
                    fail: reject
                })
                break
                // #ifdef MP-WEIXIN || H5
                // 只有微信小程序才支持chooseMessageFile接口
            case 'file':
                console.log('accept', accept)
                // #ifdef MP-WEIXIN
                wx.chooseMessageFile({
                    count: multiple ? maxCount : 1, type: accept,
                    success: (res) => resolve(formatFile(res)),
                    fail: reject
                })
                // #endif
                // #ifdef H5
                // 需要hx2.9.9以上才支持uni.onChooseFile
                uni.onChooseFile({
                    count: multiple ? maxCount : 1, type: accept,
                    success: (res) => resolve(formatFile(res)),
                    fail: reject
                })
                // #endif
                break
                // #endif
            default: 
                // 此为保底选项，在accept不为上面任意一项的时候选取全部文件
                // #ifdef MP-WEIXIN
                wx.chooseMessageFile({
                    count: multiple ? maxCount : 1, type: 'all',
                    success: (res) => resolve(formatFile(res)),
                    fail: reject
                })
                // #endif
                // #ifdef H5
                // 需要hx2.9.9以上才支持uni.onChooseFile
                uni.onChooseFile({
                    count: multiple ? maxCount : 1, type: 'all',
                    success: (res) => resolve(formatFile(res)),
                    fail: reject
                })
                // #endif
        }
    })
}
