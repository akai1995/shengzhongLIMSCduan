import { mapActions, mapGetters } from 'vuex';

const AppCoreModule = {
	mpType: 'app',
	beforeCreate() { console.log('App beforeCreate'); },
	created() { console.log('App created'); },
	computed: { ...mapGetters(['token']) },
	onLaunch: function() {
		console.log('App Launch', process.env.VUE_APP_PLATFORM);
		if (this.token) { this.GetWxInfo() }
        // #ifdef MP-WEIXIN
        updateMpWeixin()
        // #endif

		requestInterceptor()
	},
	beforeMount() { console.log('App beforeMount'); },
	onShow: function() { console.log('App Show') },
	methods: { ...mapActions(['GetWxInfo']) },
	onHide: function() { console.log('App Hide') }
}

/**
 * 下载小程序新版本并重启应用
 */
const onDownLoadUpdate = (updateManager) => {
    uni.showLoading({ title: '下载中...', mask: true }); updateManager.onUpdateReady(() => { uni.hideLoading(); updateManager.applyUpdate() })
    updateManager.onUpdateFailed(() => { uni.showModal({ title: '已经有新版本了哟~', content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~' }) })
}

const updateMpWeixin = () => {
    if (uni.canIUse('getUpdateManager')) {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate((res) => {
            if (res.hasUpdate) {
                uni.showModal({
                    title: '更新提示', content: '检测到新版本，是否下载新版本并重启小程序？',
                    success: (res) => {
                        if (res.confirm) { onDownLoadUpdate(updateManager) } 
                        else if (res.cancel) {
                            uni.showModal({
                                title: '温馨提示~', content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                                showCancel: false, confirmText: "确定更新",
                                success: (res) => { if (res.confirm) { onDownLoadUpdate(updateManager) } }
                            })
                        }
                    }
                })
            }
        })
    } else { uni.showModal({ title: '提示', content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。' }) }
}

const requestInterceptor = () => {
  uni.addInterceptor('request', {
    invoke(args) { args.url = args?.url || '' }, success(args) { if (args.statusCode === 400) { uni.$emit('z-paging-error-emit', args.data); uni.hideLoading(); uni.hideNavigationBarLoading() } },
    fail(error) { const { message, errMsg } = error; console.log('interceptor-fail', error); uni.$emit('z-paging-error-emit', errMsg||message||error); uni.hideLoading(); uni.hideNavigationBarLoading() }
  })
}

export default AppCoreModule;