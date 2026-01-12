import Vue from 'vue'
import App from './App'
import store from './store'
import uView from '@/uni_modules/uview-ui'
import $ut from '@/utils/public.js'
import share from './share.js'
import { getDicts } from "@/api/system/dict/data";
import '@/utils/mixins.js'
// import '@/convert.ts'
// 字典数据组件
import DictData from '@/components/DictData'
// import '@/imUtil/convert.ts'

uni.$zp = {
  config: {
    // 'empty-view-title-style': 'color:#18605a',
    'default-page-no': 1,
    // 配置分页默认pageSize为15
    'default-page-size': 16,
    // 配置空数据图默认描述文字为：空空如也~~
    'empty-view-text': '空空如也~~',
    // 空数据view的z-index
    'empty-view-z-index': 0,
    // ...
  },
}

// 全局挂载后使用
Vue.prototype.$store = store
Vue.prototype.$ut = $ut
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.config.productionTip = false
DictData.install()
Vue.mixin(share)
Vue.use(uView)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
