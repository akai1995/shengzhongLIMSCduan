// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
let envWx = accountInfo.miniProgram.envVersion;
// #endif
import AppConfig from '@/app/app.constant'
export default{
	filters: { toFixdNum (value, num) { if (+value) { return +(+value.toFixed(num)) } return 0; } },
    data(){
        return {
			// #ifdef MP-WEIXIN
			envWx,
			$onlineFilePath: AppConfig.onlineFilePath,
			$staticPath: AppConfig.staticPath,
			// #endif
			default_img: `${AppConfig.staticPath}imgs/default_doctor.png`,
            shareParams: {
                title: 'e-AI', path: '/pages/launch/launch',
                imageUrl: `${AppConfig.staticPath}imgs/logo.png`,
                desc: '', content: '', success: (res) => {
                    console.log(res, '发生过是');
                    if (res.errMsg == 'shareAppMessage:ok') {
                        console.log('成功', res)
                        uni.showToast({
                            title: '分享成功',
                            icon: 'success'
                        });
                    }
                },
                fail: (err) => {
                	console.error('失败', err)
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
        utComponentsRef() { return this.$refs.utComponents; }
    },
	mounted() {	
		// #ifdef MP-WEIXIN
		this.$onlineFilePath = AppConfig.onlineFilePath,
		this.$staticPath = AppConfig.staticPath,
		// #endif
		this.default_img = `${AppConfig.staticPath}imgs/default_doctor.png`,
		this.shareParams.imageUrl = `${AppConfig.staticPath}imgs/logo.png`
	},
	methods: {
		hidePhone(phone) { if (phone){ return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') } else { return phone } },
		checkUserInfo() {
			const id = this.$store.getters.userId
			if (!id) { this.$ut.jump('/sub-pack/project-pages/login/login'); return false; }
			return true;
		},
		showTips(msg, type = 'primary', duration = 1500) {
			console.log('this.utComponentsRef msg', msg)
			console.log('msg', msg)
			//#ifdef APP-PLUS
			plus.nativeUI.toast(msg, { duration: duration > 2000 ? 'long' : 'short', verticalAlign: 'top' });
			//#endif
			//#ifndef APP-PLUS
			console.log('this.utComponentsRef', this.utComponentsRef)
			if (this.utComponentsRef&&this.utComponentsRef.showUViewTips) {
				this.utComponentsRef.showUViewTips(type, msg, duration);
			} else {
				uni.showToast({ title: msg, icon: 'none', duration, mask: true })
			}
			//#endif
		},
		showConfirm(msg, success = () => {}, cancel = () => {}, title = '操作确认', confirmText = '确定', cancelText = '取消', confirmColor = '#2979ff', cancelColor = '#606266') {
			const cd = this.utComponentsRef.confirmDialog;
			cd.show = true; cd.title = title;
			cd.content = msg; cd.confirmText = confirmText;
			cd.confirmColor = confirmColor; cd.showCancelBtn = true;
			cd.cancelText = cancelText; cd.cancelColor = cancelColor;
			cd.confirm = () => {
				success();
			};
			cd.cancel = () => {
				if (cancel) cancel();
			};
		},
		showAlert(msg, success = () => {}, title = '信息提示', confirmText = '确定', confirmColor = '#2979ff') {
			const cd = this.cusComponentsRef.confirmDialog;
			cd.show = true; cd.title = title;
			cd.content = msg; cd.confirmText = confirmText;
			cd.confirmColor = confirmColor; cd.showCancelBtn = false;
			cd.confirm = () => {
				if (success) success();
			};
		},
		routeDetailEmit({ url, item }) { this.$eUni.navTo({  url, success(res) { res.eventChannel.emit('item', item) } }) },
		showSelect(rows, field) {
			const itemList = rows.map(({ label }) => label); const _self = this
			uni.showActionSheet({ itemList, success(res) { _self[field] = rows[res.tapIndex].value; _self[field + 'Name'] = rows[res.tapIndex].label } })
		},
		showPreviewImage (url) { uni.previewImage({ urls: [url], current: 0 }) },
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