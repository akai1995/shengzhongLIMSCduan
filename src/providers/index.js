/**
 * 显示消息提示框
 * @param 根据code获取name
 */
import router from '@/providers/utilities/router'
import { areaList } from '@/providers/area'

const { street_list, county_list, city_list, province_list } = areaList
export const getAddressByCode = (code, splitStr = '-') => {
	if (!code || code.length < 6) {
		return ''
	}
	const pC = code.slice(0, 2) + '0000'
	const cC = code.slice(0, 4) + '00'
	const qC = code.slice(0, 6)
	return province_list[pC] + (city_list[cC] ? splitStr + city_list[cC] : '') + (county_list[qC] ? splitStr +
		county_list[qC] : '') + (code.length >= 9 ? splitStr + street_list[code] : '')
}
/**
 * 显示消息提示框
 * @param content 提示的标题
 */
export const toast = (content) => { uni.showToast({ title: content, icon: 'none', }) }

/**
 * 显示模态弹窗
 * @param content 提示的标题
 */
export const showConfirm = (content) => {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示', content: content,
			cancelText: '取消', confirmText: '确定',
			success: (res) => resolve(res),
      fail: (err) => reject(err)
		})
	})
}

export const tansParams = (params) =>  {
	let result = ''
	for (const propName of Object.keys(params)) {
		const value = params[propName]
		var part = encodeURIComponent(propName) + "="
		if (value !== null && value !== '' && typeof(value) !== "undefined") {
			if (typeof value === 'object') {
				for (const key of Object.keys(value)) {
					if (value[key] !== null && value[key] !== '' && typeof(value[key]) !== 'undefined') {
						let params = propName + '[' + key + ']'
						var subPart = encodeURIComponent(params) + "="
						result += subPart + encodeURIComponent(value[key]) + "&"
					}
				}
			} else {
				result += part + encodeURIComponent(value) + "&"
			}
		}
	}
	return result
}

export const guid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export const debounce = (fn, delay = 500) => {
	let timer = null;
	return (...args) => {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(this, args);
			timer = null;
		}, delay);
	};
}

export const dateFormat = (date, fmt = 'YYYY-mm-dd') => { //author: meizz   
	let ret;
	let opt = {
		"Y+": date.getFullYear().toString(),        /* 年 */
		"m+": (date.getMonth() + 1).toString(),     /* 月 */
		"d+": date.getDate().toString(),            /* 日 */
		"H+": date.getHours().toString(),           /* 时 */
		"M+": date.getMinutes().toString(),         /* 分 */
		"S+": date.getSeconds().toString()          /* 秒 */
		/* 有其他格式化字符需求可以继续添加，必须转化成字符串 */
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

/* 日期格式化 */
export const parseTime = (time, pattern) => {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1, d: date.getDate(),
    h: date.getHours(), i: date.getMinutes(),
    s: date.getSeconds(), a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    /* Note: getDay() returns 0 on Sunday */
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/* 表单重置 */
export const resetForm = (refName) => {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

/* 添加日期范围 */
export const addDateRange = (params, dateRange, propName) => {
  let search = params;
  search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof (propName) === 'undefined') {
    search.params['beginTime'] = dateRange[0];
    search.params['endTime'] = dateRange[1];
  } else {
    search.params['begin' + propName] = dateRange[0];
    search.params['end' + propName] = dateRange[1];
  }
  return search;
}

/* 回显数据字典 */
export const selectDictLabel = (datas, value) => {
  if (value === undefined) {
    return '';
  }
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].value == ('' + value)) {
      actions.push(datas[key].label);
      return true;
    }
  })
  if (actions.length === 0) {
    actions.push(value);
  }
  return actions.join('');
}

/* 回显数据字典（字符串、数组） */
export const selectDictLabels = (datas, value, separator) => {
  if (value === undefined || value.length ===0) {
    return '';
  }
  if (Array.isArray(value)) {
    value = value.join(',');
  }
  var actions = [];
  var currentSeparator = undefined === separator ? ',' : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    var match = false;
    Object.keys(datas).some((key) => {
      if (datas[key].value == ('' + temp[val])) {
        actions.push(datas[key].label + currentSeparator);
        match = true;
      }
    })
    if (!match) {
      actions.push(temp[val] + currentSeparator);
    }
  })
  return actions.join('').substring(0, actions.join('').length - 1);
}

/* 字符串格式化(%s) */
export const sprintf = (str) => {
  var args = arguments, flag = true, i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

/* 转换字符串，undefined,null等转化为'' */
export const parseStrEmpty = (str) => {
  if (!str || str == "undefined" || str == "null") {
    return '';
  }
  return str;
}

/* 数据合并 */
export const mergeRecursive = (source, target) => {
  for (var p in target) {
    try {
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        source[p] = target[p];
      }
    } catch (e) {
      source[p] = target[p];
    }
  }
  return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export const handleTree = (data, id, parentId, children) => {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

/* 验证是否为blob格式 */
export const blobValidate = (data) => { return data.type !== 'application/json' }

export default {
	/**
	 * 跳转
	 * @param path 地址
	 */
	jump(path) { router.navTo({ url: path || '/pages/404/404' }) },
	/**
   * 时间 字符串截取
   * @param {*} str 
   * @returns 
   */
	strSlice(str) { if (str) { return str.slice(0, 10) } },
	/**
   * uni 提示
   * @param {*} str 
   */
	showText(str) { uni.showToast({ title: str || '敬请期待', icon: 'none' }) },
}