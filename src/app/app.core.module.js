import { mapActions, mapGetters } from 'vuex';

const AppCoreModule = {
	mpType: 'app',
	beforeCreate() {
		console.log('App beforeCreate');
	},
	created() {
		console.log('App created');
	},
	computed: {
		...mapGetters(['token'])
	},
	onLaunch: function() {
		console.log('App Launch', process.env.VUE_APP_PLATFORM);
		console.log('App Launch')
		if (this.token) { this.GetWxInfo() }
        // #ifdef MP-WEIXIN
        // 小程序发布新版本提示用户更新
        updateApp()
        // #endif

		// 注册网络请求拦截器
		requestInterceptor()
	},
	beforeMount() {
		console.log('App beforeMount');
        // const deviceType = uni.getSystemInfoSync().deviceType
        // const platform = uni.getSystemInfoSync().platform
        // // 如果是安卓，并且是微信浏览器，则不进行实人认证
        // if (deviceType == 'phone' && ['android', 'ios'].includes(platform)) { } 
        // else { uni.$u.toast('为了良好体验，请在移动端进行操作！') }
	},
	onShow: function() {
		console.log('App Show')
	},
	methods: {
		...mapActions(['GetWxInfo'])
	},
	onHide: function() {
		console.log('App Hide')
	}
}

/**
 * 
 */
const updateApp = () => {
    if (uni.canIUse('getUpdateManager')) {
        const updateManager = uni.getUpdateManager()
        //1. 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                //检测到新版本，需要更新，给出提示
                uni.showModal({
                    title: '更新提示',
                    content: '检测到新版本，是否下载新版本并重启小程序？',
                    success: (res) => {
                        if (res.confirm) {
                            //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                            downLoadUpdate(updateManager)
                        } else if (res.cancel) {
                            //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                            uni.showModal({
                                title: '温馨提示~',
                                content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                                showCancel: false, //隐藏取消按钮
                                confirmText: "确定更新", //只保留确定更新按钮
                                success: (res) => {
                                    if (res.confirm) {
                                        //下载新版本，并重新应用
                                        downLoadUpdate(updateManager)
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        uni.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
    }
}

/**
 * 下载小程序新版本并重启应用
 */
const downLoadUpdate = (updateManager) => {
    uni.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(() => {
        uni.hideLoading()
        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        uni.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
    })
}

/**
 * 网络请求拦截
 */
const requestInterceptor = () => {
  uni.addInterceptor('request', {
    invoke(args) {
      args.url = args?.url || ''
    },
    success(args) {
        // 请求成功后，统一处理返回值
        if (args.statusCode === 400) {
            // 显示z-paging网络请求错误图标
            uni.$emit('z-paging-error-emit', args.data)
            // 关闭loading
            uni.hideLoading()
            // 关闭navBarLoading
            uni.hideNavigationBarLoading()
        }
    },
    fail(error) {
        const { message, errMsg } = error
         console.log('interceptor-fail', error)
        // 显示z-paging网络请求错误图标
        uni.$emit('z-paging-error-emit', errMsg||message||error)
        // 关闭loading
        uni.hideLoading()
        // 关闭navBarLoading
        uni.hideNavigationBarLoading()
    },
  })
}

export default AppCoreModule;