import eUni from '@/providers/utilities/router'
import uView from '@/uni_modules/uview-ui'
import AppConfig from '@/app/app.constant'
import mixins from '@/providers/mixins'
import dict from '@/providers/dict'
import $ut from '@/providers/index'
import store from '@/store/index'

export const initVue = (Vue) => {
    uni.$zp = { 
        config: { 
            'default-page-no': 1, 
            'default-page-size': 10, 
            'empty-view-text': '空空如也~~', 
            'empty-view-z-index': 0,
            'call-network-reject': false 
        }
    }
    /* import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'; Vue.mixin(ZPagingMixin); */
    Vue.mixin(mixins); Vue.use(uView);
    Vue.config.productionTip = false
    // 全局挂载后使用
    Vue.prototype.$leftIcon = AppConfig.leftIcon;
    Vue.prototype.$onlineFilePath = AppConfig.onlineFilePath;
    Vue.prototype.$staticPath = AppConfig.staticPath;
    Vue.prototype.$eUni = eUni;
    Vue.prototype.onBack = () => { const canNavBack = getCurrentPages();
        if (canNavBack && canNavBack.length > 1) { eUni.navBack({ delta: 1 }) } 
        else {
            // #ifdef H5
            history.back() 
            // #endif
            // #ifdef MP-WEIXIN
            uni.reLaunch({ url: eUni.homePath })
            // #endif
        }
    }
    Vue.prototype.hasMenu = (value='') => {
        if (store&&store.getters) {
            const permission = store.getters.permission;
            const paths = permission.filter(item => item.type === 'path');
            // console.log('paths',permission, paths)
            if (paths.length>0) {
                const idx = paths.findIndex(item => item.action === value);
                return idx > -1
            }
        }
        return false
    }
    Vue.prototype.hasData = (value='') => {
        if (store&&store.getters) {
            const permission = store.getters.permission||[];
            const datas = permission.filter(item => item.type === 'data');
            // console.log('datas',permission, datas)
            if (datas.length>0) {
                const idx = datas.findIndex(item => item.action === value);
                return idx > -1
            }
        }
        return false
    }
    Vue.prototype.hasAction = (value='') => {
        if (store&&store.getters) {
            const permission = store.getters.permission;
            const actions = permission.filter(item => item.type === 'action');
            // console.log('actions',permission, actions)
            if (actions.length>0) {
                const idx = actions.findIndex(item => item.action === value);
                return idx > -1
            }
        }
        return false
    }
    Vue.prototype.$store = store;
    Vue.prototype.$ut = $ut

    // 全局方法挂载
    dict.install()
}