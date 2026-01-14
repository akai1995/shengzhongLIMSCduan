/*
 * @Description: 
 * @Version: 
 * @Author: 孙子呷约
 * @Date: 2023-10-24 12:36:14
 */

import { envWx } from '@/app/config'
const mapTokenKey = {
	develop: 'develop-token',
	trial: 'develop-token',
	release: 'App-Token',
}
let TokenKey = mapTokenKey[envWx]

export function getToken() {
  return uni.getStorageSync(TokenKey)
}

export function setToken(token) {
  return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}
export function setStorageOrgId(orgId) {
  return uni.setStorageSync('orgId', orgId)
}
