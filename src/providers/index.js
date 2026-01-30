import { setToken, getToken, setOrgId, delToken, addCache } from '@/providers/storage'
import { wxMiniCodeLogin, wxMiniLogin } from '@/app/api/login'
import { getInfoByToken } from '@/app/api/person'
import router from '@/providers/utilities/router'
import { areaList } from '@/providers/area'

const { street_list, county_list, city_list, province_list } = areaList
export const getAddressByCode = (code, splitStr = '-') => { if (!code || code.length < 6) { return '' } const pC = code.slice(0, 2) + '0000'; const cC = code.slice(0, 4) + '00'; const qC = code.slice(0, 6); return province_list[pC] + (city_list[cC] ? splitStr + city_list[cC] : '') + (county_list[qC] ? splitStr + county_list[qC] : '') + (code.length >= 9 ? splitStr + street_list[code] : '') }
export const onToast = (content) => { uni.showToast({ title: content, icon: 'none', }) }; export const onShowConfirm = (content) => { return new Promise((resolve) => { uni.showModal({ title: '提示', content: content, cancelText: '取消', confirmText: '确定', success: (res) => resolve(res), fail: (err) => reject(err) }) }) }
export const tansParams = (params) =>  { let result = ''; for (const propName of Object.keys(params)) { const value = params[propName]; var part = encodeURIComponent(propName) + '='; if (value !== null && value !== '' && typeof(value) !== 'undefined') { if (typeof value === 'object') { for (const key of Object.keys(value)) { if (value[key] !== null && value[key] !== '' && typeof(value[key]) !== 'undefined') { const params = propName + '[' + key + ']'; var subPart = encodeURIComponent(params) + '='; result += subPart + encodeURIComponent(value[key]) + '&' } } } else { result += part + encodeURIComponent(value) + '&' } } }; return result }
export const guid = () => { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8; return v.toString(16); }); }; export const debounce = (fn, delay = 500) => { let timer = null; return (...args) => { if (timer !== null) { clearTimeout(timer) }; timer = setTimeout(() => { fn.apply(this, args); timer = null }, delay) } }
export const dateFormat = (date, fmt = 'YYYY-mm-dd') => { let ret; let opt = { 'Y+': date.getFullYear().toString(), 'm+': (date.getMonth() + 1).toString(), 'd+': date.getDate().toString(), 'H+': date.getHours().toString(), 'M+': date.getMinutes().toString(), 'S+': date.getSeconds().toString() }; for (let k in opt) { ret = new RegExp('(' + k + ')').exec(fmt); if (ret) { fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0"))) } }; return fmt }

/* 日期格式化 */
export const parseTime = (time, pattern) => {
  if (arguments.length === 0 || !time) { return null } const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'; let date; if (typeof time === 'object') { date = time } else { if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) { time = parseInt(time) } else if (typeof time === 'string') { time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), ''); } if ((typeof time === 'number') && (time.toString().length === 10)) { time = time * 1000 } date = new Date(time) }
  const formatObj = { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), h: date.getHours(), i: date.getMinutes(), s: date.getSeconds(), a: date.getDay() }; const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => { let value = formatObj[key]; if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }; if (result.length > 0 && value < 10) { value = '0' + value } return value || 0 })
  return time_str
}

/* 表单重置 */
export const resetForm = (refName) => { if (this.$refs[refName]) { this.$refs[refName].resetFields() } }

/* 添加日期范围 */
export const addDateRange = (params, dateRange, propName) => {
  let search = params; search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {}; dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof (propName) === 'undefined') { search.params['beginTime'] = dateRange[0]; search.params['endTime'] = dateRange[1]; } else { search.params['begin' + propName] = dateRange[0]; search.params['end' + propName] = dateRange[1]; }
  return search;
}

/* 回显数据字典 */ export const selectDictLabel = (datas, value) => { if (value === undefined) { return ''; } var actions = []; Object.keys(datas).some((key) => { if (datas[key].value == ('' + value)) { actions.push(datas[key].label); return true; } }); if (actions.length === 0) { actions.push(value); }; return actions.join(''); }

/* 回显数据字典（字符串、数组） */
export const selectDictLabels = (datas, value, separator) => {
  if (value === undefined || value.length ===0) { return ''; }; if (Array.isArray(value)) { value = value.join(','); }; var actions = []; var currentSeparator = undefined === separator ? ',' : separator; var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => { var match = false; Object.keys(datas).some((key) => { if (datas[key].value == ('' + temp[val])) { actions.push(datas[key].label + currentSeparator); match = true; } });
  if (!match) { actions.push(temp[val] + currentSeparator); } }); return actions.join('').substring(0, actions.join('').length - 1);
}

/* 字符串格式化(%s) */ export const sprintf = (str) => { var args = arguments, flag = true, i = 1; str = str.replace(/%s/g, function () { var arg = args[i++]; if (typeof arg === 'undefined') { flag = false; return '' } return arg }); return flag ? str : '' }
/* 转换字符串，undefined,null等转化为'' */ export const parseStrEmpty = (str) => { if (!str || str == "undefined" || str == "null") { return '' } return str }
/* 数据合并 */ export const mergeRecursive = (source, target) => { for (var p in target) { try { if (target[p].constructor == Object) { source[p] = mergeRecursive(source[p], target[p]) } else { source[p] = target[p] } } catch (e) { source[p] = target[p] } } return source }

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export const handleTree = (data, id, parentId, children) => {
  let config = { id: id || 'id', parentId: parentId || 'parentId', childrenList: children || 'children' }; var childrenListMap = {}; var nodeIds = {}; var tree = [];
  for (let d of data) { let parentId = d[config.parentId]; if (childrenListMap[parentId] == null) { childrenListMap[parentId] = [] } nodeIds[d[config.id]] = d; childrenListMap[parentId].push(d); }
  for (let d of data) { let parentId = d[config.parentId]; if (nodeIds[parentId] == null) { tree.push(d) } } for (let t of tree) { adaptToChildrenList(t) }
  function adaptToChildrenList(o) { if (childrenListMap[o[config.id]] !== null) { o[config.childrenList] = childrenListMap[o[config.id]] } if (o[config.childrenList]) { for (let c of o[config.childrenList]) { adaptToChildrenList(c) } } }
  return tree;
}
/* 验证是否为blob格式 */ export const blobValidate = (data) => { return data.type !== 'application/json' }

/* 伪代码实现 */
export const eUniSet = (target, key, val) => {
  /* 如果是数组且索引有效 */
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  /* 如果对象已存在该属性 */
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  /* 获取目标对象的观察者实例 */
  const ob = target.__ob__;
  /* 如果是非响应式对象，直接赋值 */
  if (!ob) {
    target[key] = val;
    return val;
  }
  /* 将新属性转为响应式 */
  defineReactive(ob.value, key, val);
  /* 通知依赖更新 */
  ob.dep.notify();
  return val;
}

export const getWxCode = () => {
  const act = new Promise((resolve) => {
    uni.login({
      provider: 'weixin', onlyAuthorize: true, fail: (err) => { resolve({ code: 500, message: err.errMsg }) },
      success: (res) => { if (res.errMsg == "login:ok") { resolve({ code: 200, wxcode: res.code }) } else { resolve({ code: 500, message: '系统异常，请联系管理员!' }) } },      
    })
  })
  return act;
}

import StoreConfigs from '@/app/app.store.config';
import AppConfig from '@/app/app.constant';
import store from '@/store/index';
/* 刷新当前用户信息 */
export const refreshSelfInfo = (needEmitEvent = false, isRegister = false) => {
  const act = new Promise((resolve) => {
    getInfoByToken().then((res) => { console.log('获取当前用户信息结果：', res);
      uni.hideLoading(); uni.stopPullDownRefresh();
      if (res.code != 200) {
        store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, null);
        resolve({ tip: res.message, type: 'error' }); return;
      }
      const newUs = res.user; const currentUser = store.getters.currentUser; setOrgId(res.orgId);
      newUs.access_token = currentUser.access_token; newUs.expired_in = currentUser.expired_in;
      newUs.expiredTime = currentUser.expiredTime; newUs.isLogined = true;
      newUs.user_id = currentUser.user_id; newUs.orgId = res.orgId;
      newUs.avatar = newUs.avatar || `${AppConfig.staticPath}imgs/default_head.png`;      
      
      console.log('refreshSelfInfo newUs, currentUser', newUs, currentUser)
      store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, newUs);
      addCache(StoreConfigs.cacheKeys.currentUser, newUs).then((res) => {
        if (res.code == 200) {
          store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, newUs);
          if (needEmitEvent) { setTimeout(() => { uni.$emit('refreshLoginedPage'); }, 300) }
        }
        resolve({ tip: isRegister ? '用户注册成功' : '用户登录成功', type: 'success' })
      })
    })
  })
  return act;
}

export const refreshSelfInfo2 = (needEmitEvent = false, isRegister = false) => {
  const act = new Promise((resolve) => {
    getInfo().then((res) => { console.log('获取当前用户信息结果：', res);
      uni.hideLoading(); uni.stopPullDownRefresh();
      if (res.code != 200) {
        store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, null);
        resolve({ tip: res.message, type: 'error' }); return;
      }
      const newUs = res.user; const currentUser = store.getters.currentUser; setOrgId(res.orgId);
      newUs.access_token = currentUser.access_token; newUs.expired_in = currentUser.expired_in;
      newUs.expiredTime = currentUser.expiredTime; newUs.isLogined = true;
      newUs.user_id = currentUser.user_id; newUs.orgId = res.orgId;
      newUs.avatar = newUs.avatar || `${AppConfig.staticPath}imgs/default_head.png`;      
      
      console.log('refreshSelfInfo newUs, currentUser', newUs, currentUser)
      store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, newUs);
      addCache(StoreConfigs.cacheKeys.currentUser, newUs).then((res) => {
        if (res.code == 200) {
          store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, newUs);
          if (needEmitEvent) { setTimeout(() => { uni.$emit('refreshLoginedPage'); }, 300) }
        }
        resolve({ tip: isRegister ? '用户注册成功' : '用户登录成功', type: 'success' })
      })
    })
  })
  return act;
}

/* 微信登录用户 */
export const wxCodeLogin = (code, needShowLoading = true, needEmitEvent = true) => {
  console.log("wxCodeLogin code", code);
  if (needShowLoading) uni.showLoading({ title: '正在认证...', mask: true });
  const act = new Promise((resolve) => {
    wxMiniCodeLogin(code).then((res) => { console.log(`wxCodeLogin 通过code登录用户结果 res.data：`, res.data);
      if (res.code != 200) { if (needShowLoading) { uni.hideLoading() }
        store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, null); delToken();
        resolve({ tip: `通过code登录用户成功，但用户不存在，需要走注册流程：`, type: 'warning' });
        console.log(`wxMiniCodeLogin 通过code登录用户成功，但用户不存在，需要走注册流程：`, res.data); 
        return;
      }
      const loginedUs = { 
        userId: res.data.user_id, isLogined: true,
        access_token: res.data.access_token, expired_in: res.data.expired_in,
        expiredTime: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) 
      };
      store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, loginedUs);
      refreshSelfInfo(needEmitEvent).then((resp) => { resolve(resp) })
    }).catch((err)=>{ if (needShowLoading){ uni.hideLoading() } })
  })
  return act
}

/* 微信登录用户 */
export const wxRegisterLogin = (params, needShowLoading = true, needEmitEvent = true) => {
  console.log("wxMiniLogin params", params);
  if (needShowLoading) { uni.showLoading({ title: '正在登录...', mask: true }) }
  const act = new Promise((resolve) => {
    wxMiniLogin(params.code, params.phoneCode).then((res) => { console.log(`wxRegisterLogin 通过code登录用户结果 res.data：`, res, res.code != 200);
      if (res.code != 200) { if (needShowLoading) { uni.hideLoading() } 
        store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, null); delToken();
        resolve({ tip: `通过code登录用户成功，但用户不存在，需要走注册流程：`, type: 'warning' });
        console.log(`wxRegisterLogin 通过code登录用户成功，但用户不存在，需要走注册流程：`, res.data); 
        return;
      }
      const loginedUs = {
        userId: res.data.user_id, isLogined: true,
        access_token: res.data.access_token, expired_in: res.data.expired_in,
        expiredTime: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) 
      };
      store.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, loginedUs);
      refreshSelfInfo(needEmitEvent).then((resp) => { resolve(resp) })
    }).catch((err)=>{ if (needShowLoading){ uni.hideLoading() } })
  })
  return act
}

export default {
	jump(path) { router.navTo({ url: path || '/pages/404/404' }) },
	strSlice(str) { if (str) { return str.slice(0, 10) } },
	showText(str) { uni.showToast({ title: str || '敬请期待', icon: 'none' }) }  
}