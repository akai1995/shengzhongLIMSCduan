export default {
	/**
	 * 跳转
	 * @param url 地址
	 */
	jump(url) {
		if (url) {
			uni.navigateTo({
				url: url
			})
		}

	},
	//时间 字符串截取
	strSlice(str) {
		if (str) {
			return str.slice(0, 10)
		}
	},
	//uni 提示
	showText(str) {
		uni.showToast({
			title: str || '敬请期待',
			icon: 'none'
		})
	},
}
export function debounce(fn, delay = 500) {
	let timer = null;
	return function(...args) {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(this, args);
			timer = null;
		}, delay);
	};
}

export function dateFormat(date, fmt = 'YYYY-mm-dd') { //author: meizz   
	let ret;
	let opt = {
		"Y+": date.getFullYear().toString(),        // 年
		"m+": (date.getMonth() + 1).toString(),     // 月
		"d+": date.getDate().toString(),            // 日
		"H+": date.getHours().toString(),           // 时
		"M+": date.getMinutes().toString(),         // 分
		"S+": date.getSeconds().toString()          // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}