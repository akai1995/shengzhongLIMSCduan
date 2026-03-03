// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync(); let envWx = accountInfo.miniProgram.envVersion;
// #endif
import router from '@/providers/utilities/router'
import AppConfig from '@/app/app.constant'
import store from '@/store/index'
const { leftIcon, onlineFilePath, staticPath } = AppConfig
export default {
	filters: { toFixdNum (value, num) { if (+value) { return +(+value.toFixed(num)) } return 0; } },
    data() {
        return {
			// #ifdef MP-WEIXIN
			envWx, $onlineFilePath: onlineFilePath, $staticPath: staticPath, $eUni: router, $leftIcon: leftIcon,
            shareParams: {
                title: 'E-AI', path: router.homePath, imageUrl: `${staticPath}imgs/logo.png`, fail: (err) => { uni.showToast({ title: '分享失败', icon: 'error' }); },
                desc: '', content: '', success: (res) => { if (res.errMsg == 'shareAppMessage:ok') { uni.showToast({ title: '分享成功', icon: 'success' }); } },                
            },
			hasMenu: (value='') => {
				const permission = store.getters.permission||[];
				const paths = permission.filter(item => item.type === 'path');
        		console.log('paths',permission, paths)
				if (paths.length>0) {
					const idx = paths.findIndex(item => item.action === value);
					return idx > -1
				}
				return false
			},
			hasData: (value='') => {
				const permission = store.getters.permission||[];
				const datas = permission.filter(item => item.type === 'data');
        		console.log('datas',permission, datas)
				if (datas.length>0) {
					const idx = datas.findIndex(item => item.action === value);
					return idx > -1
				}
				return false
			},
			hasAction: (value='') => {
				const permission = store.getters.permission||[];
				const actions = permission.filter(item => item.type === 'action');
        		console.log('actions',permission, actions)
				if (actions.length>0) {
					const idx = actions.findIndex(item => item.action === value);
					return idx > -1
				}
				return false
			},
			// #endif
			default_img: `${staticPath}imgs/default_doctor.png`
        }
    },
    computed: { utComponentsRef() { return this.$refs.utComponents } },
	mounted() {
		const _self = this
		setTimeout(()=>{
			_self.$leftIcon = leftIcon
			// #ifdef MP-WEIXIN
			_self.$onlineFilePath = onlineFilePath; _self.$staticPath = staticPath;
			_self.$eUni = router;
			_self.$set(_self.shareParams, 'imageUrl', `${staticPath}imgs/logo.png`)
			// #endif
			_self.default_img = `${staticPath}imgs/default_doctor.png`
		}, 350)
	},
	methods: {
		hidePhone(phone) { if (phone){ return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') } else { return phone } },
		checkUserInfo() {
			const user = store.getters.currentUser;
			if (user!=null&&user.access_token) { return true; }
			this.$ut.jump('/sub-pack/project-pages/login/login');
			return false; 
		},
		showTips(msg, type = 'primary', duration = 1500) {
			console.log('this.utComponentsRef msg', msg, this.utComponentsRef)
			// #ifdef APP-PLUS
			plus.nativeUI.toast(msg, { duration: duration > 2000 ? 'long' : 'short', verticalAlign: 'top' });
			// #endif
			// #ifndef APP-PLUS
			if (this.utComponentsRef&&this.utComponentsRef.showUViewTips) { this.utComponentsRef.showUViewTips(type, msg, duration); } else { uni.showToast({ title: msg, icon: 'none', duration, mask: true }) }
			// #endif
		},
		showConfirm(msg, success = () => {}, cancel = () => {}, title = '操作确认', confirmText = '确定', cancelText = '取消', confirmColor = '#2979ff', cancelColor = '#606266') { const cd = this.utComponentsRef.confirmDialog; cd.show = true; cd.title = title; cd.content = msg; cd.confirmText = confirmText; cd.confirmColor = confirmColor; cd.showCancelBtn = true; cd.cancelText = cancelText; cd.cancelColor = cancelColor; cd.confirm = () => { success(); }; cd.cancel = () => { if (cancel) { cancel(); } }; },
		showAlert(msg, success = () => {}, title = '信息提示', confirmText = '确定', confirmColor = '#2979ff') { const cd = this.utComponentsRef.confirmDialog; cd.show = true; cd.title = title; cd.content = msg; cd.confirmText = confirmText; cd.confirmColor = confirmColor; cd.showCancelBtn = false; cd.confirm = () => { if (success) {success();} }; },
		routeDetailEmit({ url, item }) { this.$eUni.navTo({  url, success(res) { res.eventChannel.emit('item', item) } }) },
		showSelect(rows, field) { const itemList = rows.map(({ label }) => label); const _self = this; uni.showActionSheet({ itemList, success(res) { _self[field] = rows[res.tapIndex].value; _self[field + 'Name'] = rows[res.tapIndex].label } }) },
		showPreviewImage (url) { uni.previewImage({ urls: [url], current: 0 }) },
	},
	// #ifdef MP-WEIXIN
    onShareAppMessage:(res) => { return this.shareParams }, onShareTimeline:(res) => { return this.shareParams }, onAddToFavorites:(res) => { return this.shareParams }
	// #endif
}