
// #ifdef MP-WEIXIN
import config from '@/app/app.config'
const tokenKeyMap = {
	develop: 'developToken',
	trial: 'developToken',
	release: 'releaseToken',
}
var tokenKey = tokenKeyMap[config.envWx]
// #endif
// #ifndef MP-WEIXIN
var tokenKey = 'appConfigToken'
// #endif
export function getToken() { return uni.getStorageSync(tokenKey) }
export function setToken(token) { return uni.setStorageSync(tokenKey, token) }
export function removeToken() { return uni.removeStorageSync(tokenKey) }
export function setStorageOrgId(orgId) { return uni.setStorageSync('orgId', orgId) }
