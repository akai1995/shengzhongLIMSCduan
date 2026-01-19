import { getDictByType } from '@/app/api/system/dict/data'
import router from '@/providers/utilities/router'
import uView from '@/uni_modules/uview-ui'
import constant from '@/app/app.constant'
import mixins from '@/providers/mixins'
import $ut from '@/providers/index'
import store from '@/store/index';

// 字典数据组件
import DictData from '@/components/DictData'
// import '@/imUtil/convert.ts'

export const initVue = (Vue) => {
    uni.$zp = {
        config: {
            // 'empty-view-title-style': 'color:#18605a',
            // 'paging-style': 'background-color: white;height: 100vh;',
            'default-page-no': 1,
            // 配置分页默认pageSize为15
            'default-page-size': 10,
            // 配置空数据图默认描述文字为：空空如也~~
            'empty-view-text': '空空如也~~',
            // 空数据view的z-index
            'empty-view-z-index': 0,
            // 请求失败时不触发reject，避免控制台报错
            'call-network-reject': false
        }
    }

    // import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';
    // Vue.mixin(ZPagingMixin);

    Vue.mixin(mixins); Vue.use(uView);

    Vue.config.productionTip = false
    // 全局挂载后使用
    Vue.prototype.$staticPath = constant.staticPath
    Vue.prototype.$eUni = router
    Vue.prototype.onBack = () => {
    const canNavBack = getCurrentPages();
    if (canNavBack && canNavBack.length > 1) {
        router.navBack({ delta: 1 });
    } else {
        history.back();
    }
    }
    Vue.prototype.getDictByType = getDictByType
    Vue.prototype.$store = store
    Vue.prototype.$ut = $ut

    // 全局方法挂载
    DictData.install()
}