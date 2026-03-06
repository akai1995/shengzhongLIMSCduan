import StoreConfigs from '@/app/app.store.config';
import EventsConfigs from '@/app/app.event.config';
import store from '@/store/index';
import Clipboard from 'clipboard';

// #ifdef MP-WEIXIN
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
// #endif

const requestInterceptor = () => {
  uni.addInterceptor('request', {
    invoke(args) { args.url = args?.url || '' }, success(args) { if (args.statusCode === 400) { uni.$emit('z-paging-error-emit', args.data); uni.hideLoading(); uni.hideNavigationBarLoading() } },
    fail(error) { const { message, errMsg } = error; console.log('interceptor-fail', error); uni.$emit('z-paging-error-emit', errMsg||message||error); uni.hideLoading(); uni.hideNavigationBarLoading() }
  })
}

/**
 * 初始化数据
 */
const initData = (options) => {
    if (store&&store.dispatch) {
        // #ifndef APP-PLUS
            // if (/android/i.test(navigator.userAgent)) { store.commit('savePhoneType', 1) }
            // if (/ipad|iphone|mac/i.test(navigator.userAgent)) { store.commit('savePhoneType', 2) }
        // #endif
        
        // 从缓存中获取用户信息，如果用户token过期，重新认证，然后保存到Vuex中
        store.dispatch(StoreConfigs.vuex.userModule.actions.updateCurrentUserAction, (res)=>{
            console.log('initData updateCurrentUserAction', res)
        });
        store.dispatch(StoreConfigs.vuex.userModule.actions.updatePermissionAction, (res)=>{
            console.log('initData updatePermissionAction', res)
        });
    }
};

const AppCoreModule = {
	mpType: 'app',
    beforeCreate: () => { console.log('App beforeCreate'); },
	created: () => { console.log('App created'); },
	onLaunch: (options) => {
		console.log('App Launch', process.env.VUE_APP_PLATFORM);
        // #ifdef MP-WEIXIN
        updateMpWeixin()
        // #endif
		// #ifndef MP-WEIXIN
		window.askMoreChat = (text) => { uni.$emit(EventsConfigs.eventNames.askMoreChat, { q: text }) }
		window.copyCode = (codeId) => { console.log('codeId', codeId);
			const clipboard = new Clipboard(`#${codeId}`, {
                text(trigger) { console.log(trigger);
                    return trigger.outerText.replace(/复制\n/g, '\n');
                }
            });
            clipboard.on('success', (_event) => {
                uni.showToast({ title: '复制成功', icon: 'success' });
                clipboard.destroy()
            });
			clipboard.on('error', (_event) => {
                uni.showToast({ title: '复制失败', icon: 'error' });
                clipboard.destroy()
            });
		};
		// #endif
		requestInterceptor();
        initData(options);
	},
	beforeMount: () => { console.log('App beforeMount'); },
    onShow: () => { console.log('App Show') },
    onHide: () => { console.log('App Hide') }
}

export default AppCoreModule;