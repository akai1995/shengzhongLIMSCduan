export default class UI {
	static _rect;

	/**
	 * rpx转px
	 */
	static toPx(num) {
		return uni.upx2px(num);
	}

	/**
	 * px转rpx
	 */
	static toRpx(num) {
		return num / (uni.upx2px(100) / 100);
	}

	/**
	 * 获取当前设备宽高
	 */
	static get rect() {
		if (!this._rect) {
			let info = uni.getSystemInfoSync();
			this._rect = { width: info.screenWidth, height: info.screenHeight };
		}
		return this._rect;
	}

	/**
	 * 导航高度
	 */
	static get headerBarHeight() {
		// #ifdef APP-PLUS || H5
		return 44;
		// #endif
		// #ifdef MP
		// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
		// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
		// return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
		let height = uni.getSystemInfoSync().platform == 'ios' ? 44 : 48;
		return height;
		// #endif
	}

	/*
	 *状态栏高度
	 */
	static get statusBarHeight() {
		return uni.getSystemInfoSync().statusBarHeight;
	}

	/**
	 * 去掉所有的html标记
	 * @param str
	 */
	delHtmlTag(str) {
		return str.replace(/<[^>]+>/g, '');
	}

	/**
	 * 毫秒转换友好的显示格式
	 * 输出格式：21小时前
	 * @param  {[type]} time [description]
	 * @return {[type]}      [description]
	 */
	friendlyDateStr(date) {
		// 获取js 时间戳
		let time = new Date().getTime();
		// 去掉 js 时间戳后三位，与php 时间戳保持一致
		time = (time - date) / 1000;

		// 存储转换值
		let s;
		if (time < 60 * 3) {
			// 三分钟内
			return '刚刚';
		} else if (time < 60 * 60 && time >= 60 * 3) {
			// 超过三分钟少于1小时
			s = Math.floor(time / 60);
			return `${s}分钟前`;
		} else if (time < 60 * 60 * 24 && time >= 60 * 60) {
			// 超过1小时少于24小时
			s = Math.floor(time / 60 / 60);
			return `${s}小时前`;
		} else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
			// 超过1天少于3天内
			s = Math.floor(time / 60 / 60 / 24);
			return `${s}天前`;
		} else {
			// 超过3天
			const dd = new Date(date);
			return `${dd.getFullYear()}/${dd.getMonth() + 1}/${dd.getDate()}`;
		}
	}

	/**
	 * 将日期字符串格式化为日期
	 * @param mdate
	 * @returns
	 */
	static formatTime(mdate) {
		let md = mdate.replace('T', ' ').replace(/-/g, '/');
		if (md.lastIndexOf('.') !== -1) md = md.substring(0, md.lastIndexOf('.'));
		return new Date(md);
	}
}
