/**
 * 显示消息提示框
 * @param 根据code获取name
 */
import { areaList } from '@/providers/area.js'
const { street_list, county_list, city_list, province_list } = areaList
export function getAddressByCode(code, splitStr = '-') {
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
export function toast(content) {
	uni.showToast({
		icon: 'none',
		title: content
	})
}

/**
 * 显示模态弹窗
 * @param content 提示的标题
 */
export function showConfirm(content) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: content,
			cancelText: '取消',
			confirmText: '确定',
			success: function(res) {
				resolve(res)
			}
		})
	})
}

/**
 * 参数处理
 * @param params 参数
 */
export function tansParams(params) {
	let result = ''
	for (const propName of Object.keys(params)) {
		const value = params[propName]
		var part = encodeURIComponent(propName) + "="
		if (value !== null && value !== "" && typeof(value) !== "undefined") {
			if (typeof value === 'object') {
				for (const key of Object.keys(value)) {
					if (value[key] !== null && value[key] !== "" && typeof(value[key]) !== 'undefined') {
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