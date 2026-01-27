import { getDictByType } from '@/app/api/dict'; import router from '@/providers/utilities/router';
import uView from '@/uni_modules/uview-ui'; import AppConfig from '@/app/app.constant'; import mixins from '@/providers/mixins'; 
import dict from '@/providers/dict'; import $ut from '@/providers/index'; import store from '@/store/index';

export const initVue = (Vue) => {
    uni.$zp = { config: {  'default-page-no': 1, 'default-page-size': 10, 'empty-view-text': '空空如也~~', 'empty-view-z-index': 0, 'call-network-reject': false } }

    /* import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'; Vue.mixin(ZPagingMixin); */
    Vue.mixin(mixins); Vue.use(uView); Vue.config.productionTip = false
    // 全局挂载后使用
    Vue.prototype.$staticPath = AppConfig.staticPath; Vue.prototype.$onlineFilePath = AppConfig.onlineFilePath; Vue.prototype.$eUni = router;
    Vue.prototype.onBack = () => { 
        const canNavBack = getCurrentPages(); 
        if (canNavBack && canNavBack.length > 1) { router.navBack({ delta: 1 }) } 
        else {
            // #ifdef H5
            history.back() 
            // #endif
            // #ifdef MP-WEIXIN
            uni.reLaunch({ url: router.homePath })
            // #endif
        } 
    }
    Vue.prototype.getDictByType = getDictByType; Vue.prototype.$store = store; Vue.prototype.$ut = $ut

    // 全局方法挂载
    dict.install()
}