import Vue from 'vue'
// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
let envWx = accountInfo.miniProgram.envVersion;
// #endif
Vue.mixin({
	data() {
		return {
			// #ifdef MP-WEIXIN
			envWx, $staticPath: 'https://genepiapi.ypzlfx.com/file/',
			// #endif
			default_img: this.$staticPath+'genepi/2023/11/24/Mask group@2x_20231124181155A412.png',
		}
	},
	filters: {
		toFixdNum (value, num) {
			if (+value) {
				return +(+value.toFixed(num))
			}
			return 0
		}
	},
	methods: {
		checkUserInfo() {
			const id = this.$store.getters.userId
			if (!id) {
				this.$ut.jump("/project-pages/login/login");
				return;
			}
		},
		routePush({
			url
		}) {
			this.$eUni.navTo({
				url,
			})
		},
		routeDetailEmit({
			url,
			item
		}) {
			this.$eUni.navTo({
				url,
				success(res) {
					res.eventChannel.emit('item', item)
				}
			})
		},
		async showSelct(arr, field) {
			const itemList = arr.map(({
				label
			}) => label)
			let that = this
			uni.showActionSheet({
				itemList,
				success(res) {
					that[field] = arr[res.tapIndex].value
					that[field + 'Name'] = arr[res.tapIndex].label
				}
			})
		},
		showPreviewImage (url) {
			uni.previewImage({
				urls: [url],
				current: 0
			})
		}
	}
})