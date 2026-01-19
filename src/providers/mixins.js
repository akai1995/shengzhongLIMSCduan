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
    computed: {
        /**
         * 获取自定义组件群引用
         */
        utComponentsRef() {
            return this.$refs.utComponents;
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
		/**
		 * 显示顶端提示
		 * @param msg 提示内容
		 * @param type : 'primary' | 'success' | 'info' | 'warning' | 'error'
		 * @param duration 默认2000毫秒关闭
		 */
		showTips(msg, type = 'primary', success = () => {}, duration = 1500) {
			console.log('this.utComponentsRef', this.utComponentsRef)
			//#ifdef APP-PLUS
			plus.nativeUI.toast(msg, { duration: duration > 2000 ? 'long' : 'short', verticalAlign: 'top' });
			//#endif
			//#ifndef APP-PLUS
			this.utComponentsRef.showUViewTips(type, msg, duration);
			//#endif
			console.log('msg', msg)
		},
		/**
		 * 显示确认对话框
		 * @param msg 问题内容 支持html
		 * @param success 确认回调
		 * @param cancel 取消回调
		 * @param title 对话框标题 默认：操作确认
		 * @param confirmText 确认按钮文字 默认：确定
		 * @param cancelText 取消按钮文字 默认：取消
		 * @param confirmColor 确认按钮颜色 默认：#2979ff
		 * @param cancelColor 取消按钮颜色 默认：#606266
		 */
		showConfirm(msg, success = () => {}, cancel = () => {}, title = '操作确认', confirmText = '确定', cancelText = '取消', confirmColor = '#2979ff', cancelColor = '#606266') {
			const cd = this.utComponentsRef.confirmDialog;
			cd.show = true; cd.title = title;
			cd.content = msg;
			cd.confirmText = confirmText;
			cd.confirmColor = confirmColor;
			cd.showCancelBtn = true;
			cd.cancelText = cancelText;
			cd.cancelColor = cancelColor;
			cd.confirm = () => {
				success();
			};
			cd.cancel = () => {
				if (cancel) cancel();
			};
		},
		/**
		 * 显示信息提示
		 * @param msg 提示内容 支持html
		 * @param success 确认回调
		 * @param title 标题 默认：信息提示
		 * @param confirmText 确认按钮文字 默认：确定
		 * @param confirmColor 确认按钮颜色 默认：#2979ff
		 */
		showAlert(msg, success = () => {}, title = '信息提示', confirmText = '确定', confirmColor = '#2979ff') {
			const cd = this.cusComponentsRef.confirmDialog;
			cd.show = true;
			cd.title = title;
			cd.content = msg;
			cd.confirmText = confirmText;
			cd.confirmColor = confirmColor;
			cd.showCancelBtn = false;
			cd.confirm = () => {
				if (success) success();
			};
		},
		routePush({ url }) {
			if (url) { this.$eUni.navTo({ url }) } else { this.$eUni.navTo({ url: '' }) }			
		},
		routeDetailEmit({ url, item }) { this.$eUni.navTo({  url, success(res) { res.eventChannel.emit('item', item) } }) },
		async showSelect(rows, field) {
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