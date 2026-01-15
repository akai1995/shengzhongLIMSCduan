// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
let envWx = accountInfo.miniProgram.envVersion;
// #endif
export default{
	filters: {
		toFixdNum (value, num) {
			if (+value) {
				return +(+value.toFixed(num))
			}
			return 0
		}
	},
    data(){
        return {
			// #ifdef MP-WEIXIN
			envWx, $staticPath: 'https://genepiapi.ypzlfx.com/file/',
			// #endif
			default_img: this.$staticPath+'genepi/2023/11/24/Mask group@2x_20231124181155A412.png',
            shareParams: {
                title: 'e-AI',
                path: '/pages/launch/launch',
                imageUrl: this.$staticPath+'genepi/2023/11/13/AKtZ1IVhxRiWc97110247ad6760c4f750448fbc3371b_20231113171945A939.png',
                desc: '',
                content: '',
                success: (res) => {
                    console.log(res, '发生过是');
                    if (res.errMsg == 'shareAppMessage:ok') {
                        console.log("成功", res)
                        uni.showToast({
                            title: '分享成功',
                            icon: 'success'
                        });
                    }
                },
                fail: (err) => {
                console.error("失败", res)
                    uni.showToast({
                        title: '分享失败',
                        icon: 'error'
                    });
                }
            }
        }
    },
	methods: {
		checkUserInfo() {
			const id = this.$store.getters.userId
			if (!id) {
				this.$ut.jump("/sub-pack/project-pages/login/login");
				return false;
			}
			return true;
		},
		showToast(msg, icon = 'none', success=()=>{}, duration = 1500) {
			uni.showToast({
				msg: msg, icon: icon,
				duration: duration,
				success: success
			});
		},
		routePush({ url }) {
			if (url) { this.$eUni.navTo({ url }) } else { this.$eUni.navTo({ url: '' }) }
			
		},
		routeDetailEmit({ url, item }) { this.$eUni.navTo({  url, success(res) { res.eventChannel.emit('item', item) } }) },
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
		},
	},
    // 监听用户点击右上角菜单的「转发」按钮时触发的事件
    onShareAppMessage() {
        // 设置转发的参数
        return this.shareParams
    },
    // 分享到朋友圈
    onShareTimeline:function(res){
        return this.shareParams
    },
    // 收藏
    onAddToFavorites:function(res) {
        return this.shareParams
    }
}