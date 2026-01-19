// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
let envWx = accountInfo.miniProgram.envVersion;
// #endif
import constant from '@/app/app.constant'
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
			envWx, $staticPath: constant.staticPath,
			// #endif
			default_img: `${constant.staticPath}temp/imgs/default_doctor.png`,
            shareParams: {
                title: 'e-AI',
                path: '/pages/launch/launch',
                imageUrl: `${constant.staticPath}temp/imgs/logo.png`,
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
                console.error("失败", err)
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
		showTips(msg, icon = 'none', success=()=>{}, duration = 1500) {
			console.log('msg', msg)
			uni.showToast({
				title: msg, icon: icon,
				duration: duration,
				success: success
			});
		},
		routePush({ url }) {
			if (url) { this.$eUni.navTo({ url }) } else { this.$eUni.navTo({ url: '' }) }			
		},
		routeDetailEmit({ url, item }) { this.$eUni.navTo({  url, success(res) { res.eventChannel.emit('item', item) } }) },
		async showSelct(rows, field) {
			const itemList = rows.map(({ label }) => label)
			let that = this
			uni.showActionSheet({
				itemList,
				success(res) {
					that[field] = rows[res.tapIndex].value
					that[field + 'Name'] = rows[res.tapIndex].label
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