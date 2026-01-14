import store from '@/store'; import config from '@/app/config'
import { getToken } from '@/providers/auth'
import errorCode from '@/providers/utilities/errorCode'
import { toast, showConfirm, tansParams } from '@/providers/common'

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
        data: config.data,
        header: config.header,
        dataType: 'json'
      }).then(response => {
        let [error, res] = response
        if (error) {
          toast('后端接口连接异常')
          reject('后端接口连接异常')
          return
        }
        const code = res.data.code || 200
        const msg = errorCode[code] || res.data.message || errorCode['default']
        if (code === 401) {
			if(toLogin) { return }
			toLogin = true
          // showType = true
          // showConfirm('登录状态已过期，请重新登录').then(res => {
			  // uni.reLaunch({ url: '/project-pages/login/login' })
			  uni.navigateTo({ url: '/project-pages/login/login', complete:()=>{ toLogin = false } })
    //       showConfirm('请登录查看').then(res => {
				// if(res.confirm){
				// 	store.dispatch('WxLogOut').then(res => {
				// 	  uni.reLaunch({ url: '/project-pages/login/login' })
				// 	  showType = false
				// 	})
				// }else if(res.cancel){
				// 	 uni.reLaunch({ url: '/pages/launch/launch' })
				// 	 showType = false
				// }
    //       })
          reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
          toast(msg)
          reject('500')
        } else if (code !== 200) {
          toast(msg)
          reject(code)
        }
		
        resolve(res.data)
      })
      .catch(error => {
        let { message } = error
        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        toast(message)
        reject(error)
      })
  })
}

export default request
