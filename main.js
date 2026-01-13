import Vue from 'vue'
import App from './App';
import router from '@/providers/router'
import store from './store'
import share from './share.js'
import uView from '@/uni_modules/uview-ui'
import $ut from '@/providers/public.js'
import { getDicts } from "@/api/system/dict/data";
import '@/providers/mixins.js'
// import '@/convert.ts'
// 字典数据组件
import DictData from '@/components/DictData'
// import '@/imUtil/convert.ts'

uni.$zp = {
  config: {
    // 'empty-view-title-style': 'color:#18605a',
    'paging-style': 'background-color: white;',
    'default-page-no': 1,
    // 配置分页默认pageSize为15
    'default-page-size': 10,
    // 配置空数据图默认描述文字为：空空如也~~
    'empty-view-text': '空空如也~~',
    // 空数据view的z-index
    'empty-view-z-index': 0,
    // ...
  },
}

Vue.mixin(share)
Vue.use(uView)

Vue.config.productionTip = false
// 全局挂载后使用
Vue.prototype.$staticPath = 'https://genepiapi.ypzlfx.com/file/'
Vue.prototype.$eUni = router
Vue.prototype.$store = store
Vue.prototype.$ut = $ut
Vue.prototype.getDicts = getDicts
// 全局方法挂载
DictData.install()

App.mpType = 'app';
const app = new Vue({ 
	...App, store 
});
app.$mount();
