import config from '@/app/app.config'; import { getToken } from '@/providers/auth'
import { toast, showConfirm, tansParams } from '@/providers/common'
import errorCode from '@/providers/utilities/errorCode'

let timeout = 10000
const baseUrl = config.baseUrl
let showType = false
let toLogin = false


const request = config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['X-Access-Token'] = getToken()
  }
  // get请求映射params参数
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.url = url
  }
  return new Promise((resolve, reject) => {
    uni.request({
        method: config.method || 'get',
        timeout: config.timeout ||  timeout,
        url: config.baseUrl || baseUrl + config.url,
        data: config.data, header: config.header,
        dataType: 'json',
				success: (response) => {
          // let [error, res] = response
          const { statusCode, errMsg, data } = response
          const code = data.code || 200
          const msg = errorCode[code] || data.message || errorCode['default']
          if (statusCode === 401||code === 401) {
            if(toLogin) { return }
            toLogin = true
            // showType = true
            // showConfirm('登录状态已过期，请重新登录').then(res => {
            // uni.reLaunch({ url: '/sub-pack/project-pages/login/login' })
            uni.navigateTo({ url: '/sub-pack/project-pages/login/login', complete:()=>{ toLogin = false } })
            // showConfirm('请登录查看').then(res => {
            // if (res.confirm) {
            // 	store.dispatch('WxLogOut').then(res => {
            // 	  uni.reLaunch({ url: '/sub-pack/project-pages/login/login' }); showType = false
            // 	})
            // } else if(res.cancel) {
            // 	 uni.reLaunch({ url: '/pages/launch/launch' }); showType = false
            // }
            // })
            reject('无效的会话，或者会话已过期，请重新登录。')
          } else if (statusCode === 500||code === 500) {
            toast(msg)
            reject('500')
          } else if (statusCode === 200 && code === 200) {
            resolve(data)
          } else {
            toast(msg)
            reject(code)
          }
				},
				fail: (error) => {
          console.log('error', error)
          const { message, errMsg } = error
          if (message) {
            if (message === 'Network Error') {
              message = '后端接口连接异常'
            } else if (message.includes('timeout')) {
              message = '系统接口请求超时'
            } else if (message.includes('Request failed with status code')) {
              message = '系统接口' + message.substr(message.length - 3) + '异常'
            }
            toast(message)
            reject(message)
          } 
          if (errMsg) {
            console.log('errMsg', errMsg)
            toast(errMsg)
            reject(errMsg)
          }
				}
      })
  })
}

export default {
  get: (option) => {
    return request({ method: 'get', ...option })
  },
  post: (option) => {
    return request({ method: 'post', ...option })
  },
  del: (option) => {
    return request({ method: 'delete', ...option })
  },
  put: (option) => {
    return request({ method: 'put', ...option })
  }
}