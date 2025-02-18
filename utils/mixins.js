import Vue from 'vue'
const accountInfo = uni.getAccountInfoSync();
let envWx = accountInfo.miniProgram.envVersion;
Vue.mixin({
	data() {
		return {
			envWx,
			default_img: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Mask group@2x_20231124181155A412.png',
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
		routePush({
			url
		}) {
			uni.navigateTo({
				url,
			})
		},
		routeDetailEmit({
			url,
			item
		}) {
			uni.navigateTo({
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