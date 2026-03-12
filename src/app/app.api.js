import httpStatusCode from '@/providers/utilities/httpStatusCode';
import { getToken, delToken } from '@/providers/storage';
import { onToast, tansParams } from '@/providers/index';
import router from '@/providers/utilities/router';
import config from '@/app/app.config';
import store from '@/store/index';

const timeout = (60 * 1000); const baseUrl = config.baseUrl; let toLogin = false

/**
 * 移除 空值、null值、undefined值以及一些特殊字段值
 * @param some
 * @param method
 * @returns
 */
const noEmpty = (some, method) => {
  const hasEmpty = (str) => {
    if (typeof str != 'number' && typeof str != 'boolean') { return !!!str || str == null; }
    return false;
  };
  for (const key in some) {
    if (
      ['', undefined, 'undefined', null, 'null', '00000000-0000-0000-0000-000000000000', '0001-01-01T00:00:00'].includes(some[key]) ||
      typeof some[key] == 'undefined' || typeof some[key] == 'null' || some[key].length == 0 || ((key == 'skipCount' || key == 'SkipCount') && some[key] == 0) ||
      key.slice(0, 1).indexOf('$') > -1
    ) { delete some[key] }
    if (typeof some[key] == 'string' && some[key].indexOf(' 00:00:00') > -1) { some[key] = some[key].replace(/ 00:00:00/g, '') }
    if (typeof some[key] == 'object') { some[key] = noEmpty(some[key], method) }
  }
  return some;
}

const checkData = (some) => {
  for (const key in some) {
    const hasEmpty = (str) => { if (typeof str != 'number' && typeof str != 'boolean') { return !!!str || str == null } return false };
    if (hasEmpty(some[key]) || some[key] == '00000000-0000-0000-0000-000000000000' || some[key] == '0001-01-01T00:00:00') { some[key] = '' }
    if (['roles'].includes(key)&&hasEmpty(some[key])) { some[key] = [] }
    if (typeof some[key] == 'object') { some[key] = checkData(some[key]) }
  }
  return some;
};
const request = config => {
  const isToken = (config.headers || {}).isToken == false; config.header = config.header || {}
  if ((store.getters.token || getToken()) && !isToken) { config.header['X-Access-Token'] = store.getters.token || getToken() }
  if (config.params) { let url = config.url + '?' + tansParams(noEmpty(config.params, config.method || 'get')); url = url.slice(0, -1); config.url = url; }
  return new Promise((resolve, reject) => {
    uni.request({
        method: config.method || 'get',
        timeout: config.timeout || timeout,
        url: config.baseUrl || baseUrl + config.url,
        data: noEmpty(config.data, config.method || 'get'),
        header: config.header, dataType: 'json',
				success: (response) => {
          console.log('response', response);
          const { statusCode, errMsg, data } = response; const code = data.code || 200;
          const msg = data.message || httpStatusCode[code] || httpStatusCode['default']
          if (statusCode == 401||code == 401) {
            if(toLogin) { delToken(); return; }; toLogin = true;
            console.log(router, '401', '无效的会话，或者会话已过期，请重新登录。');
            router.navTo({
              url: router.loginPath,
              complete:()=>{ toLogin = false }
            })
            reject('无效的会话，或者会话已过期，请重新登录。')
          } 
          else if (statusCode == 500||code == 500) { console.error('msg', msg); onToast(msg); reject('500') } 
          else if (statusCode == 200 && code == 200) {
            const objData = data;
            if (objData.hasOwnProperty('message')) { delete objData.message; };
            if (objData.hasOwnProperty('result')) {
              if (!objData.data&&objData.result) { objData.data = objData.result };
              delete objData.result;
            };
            resolve(checkData(objData))
          }
          else { console.error('msg', msg); onToast(msg); reject(code) }
				},
				fail: (error) => {
          console.error('error', error); const { message, errMsg } = error
          if (typeof message=='string') { 
            if (message == 'Network Error') { message = '后端接口连接异常' }
            else if (message.includes('timeout')) { message = '系统接口请求超时' }
            else if (message.includes('Request failed with status code')) {  message = '系统接口' + message.substr(message.length - 3) + '异常' }; 
            console.error('message', message); onToast(message); reject(message) 
          }
          else if (typeof errMsg=='string') { console.log('errMsg', errMsg); onToast(errMsg); reject(errMsg) }
          else { console.log('errMsg', '异常'); onToast('异常'); reject(error) }
				}
      })
  })
}

export default {
  get:  (option) => request({ method: 'get', ...option }),
  post: (option) => request({ method: 'post', ...option }),
  del:  (option) => request({ method: 'delete', ...option }),
  put:  (option) => request({ method: 'put', ...option }),
}