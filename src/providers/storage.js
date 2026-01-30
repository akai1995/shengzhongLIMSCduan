import StoreConfigs from '@/app/app.store.config'

let storageKey = 'storage_data'; let storageNodeKeys = [...Object.values(StoreConfigs.cacheKeys)]; let storageData = uni.getStorageSync(storageKey) || {}
const storage = {
  set: (key, value) => { if (storageNodeKeys.indexOf(key) != -1) { let tmp = uni.getStorageSync(storageKey); tmp = tmp ? tmp : {}; tmp[key] = value; uni.setStorageSync(storageKey, tmp) } },
  get: (key) => { return storageData[key] || '' },
  remove: (key) => { delete storageData[key]; uni.setStorageSync(storageKey, storageData) },
  clean: () => { uni.removeStorageSync(storageKey) }
}

export default storage

import config from '@/app/app.config'
// #ifdef MP-WEIXIN
const tokenKeyMap = { 'develop': 'app:eai.developToken', 'trial': 'app:eai.developToken', 'release': 'app:eai.releaseToken', };
var tokenKey = tokenKeyMap[config.envWx];
// #endif
// #ifdef H5
var tokenKey = 'app:eai.appConfigToken'
// #endif
export function getToken() { return uni.getStorageSync(tokenKey) };
export function setToken(token) { return uni.setStorageSync(tokenKey, token) }
export function delToken() { return uni.removeStorageSync(tokenKey) };
export function setOrgId(orgId) { return orgId ? uni.setStorageSync('app:eai.orgId', orgId) : uni.removeStorageSync('app:eai.orgId') }

export const addCache = (key, data, expireTime) => {
  try { uni.removeStorageSync(key); } catch (e) { }
  const act = new Promise((resolve) => {
    if (expireTime == null || expireTime == undefined) expireTime = 0; let d = null; if (data == null || data === undefined) { resolve({ code: 500, message: '空对象，放弃存储' }); return; }; d = { _id: key, cacheDate: '', data: [], isArray: false };
    if (Array.isArray(data)) { if (data.length === 0) { resolve({ code: 500, message: '空数组对象，放弃存储' }); return; } d.data = data; d.isArray = true; } else { d.data.push(data); d.isArray = false; }
    d.cacheDate = new Date().valueOf(); d.expireTime = expireTime; uni.setStorage({ key: key, data: d, success: () => { resolve({ code: 200, message: '缓存添加成功' }); }, fail: (err) => { resolve({ code: 500, message: err.errMsg }); } })
  })
  return act;
}

export const getCache = (key) => new Promise((resolve) => { uni.getStorage({ key: key, success: (res) => { const exp = res.data['expireTime']; const cacheDate = res.data['cacheDate']; if (exp > 0) { const currffSet = new Date().valueOf(); const offSet = (currffSet - cacheDate) / 60000; console.log(`缓存Key:${key},当前offSet:` + offSet); if (offSet > exp) { this.deleteCacheSync(key); resolve({ code: 500, message: `缓存${key}已过期` }); console.log(`缓存Key:${key},已过期`); return; } }; const lst = res.data['data']; if (res.data.isArray === true) { resolve({ code: 200, data: lst }); return; }; resolve({ code: 200, data: lst[0] }) }, fail: (err) => { resolve({ code: 500, message: err.errMsg }) }})})
export const getWithCache = (key, query) => new Promise((resolve) => { getCache(key).then((res) => { if (res.code === 200) resolve(res); else { setTimeout(() => { query.then((res)=>resolve(res)).catch((err)=>resolve(err)) }, 150) } }) })
export const delCache = (key) => new Promise((resolve) => { uni.removeStorage({ key: key, success: () => { resolve({ code: 200, message: '缓存删除成功' }) }, fail: () => { resolve({ code: 500, message: '缓存删除失败' }) } }) })
export const delCacheSync = (key) => { uni.removeStorageSync(key) }; export const clearCache = () => { uni.clearStorage() }
