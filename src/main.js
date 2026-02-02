import { initVue } from '@/app/app.commom'
import './uni.promisify.adaptor'
import App from '@/App.vue';
import Vue from 'vue'

initVue(Vue);

// #ifdef H5
import { router, RouterMount } from '@/route'
console.log('router', router)
Vue.use(router);

// 创建app实例并立即挂载到#app元素
const app = new App({
  router
});
RouterMount(app, router, '#app')

// #endif

// #ifndef H5
const app = new App();
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif

console.warn = () => {}
console.warn = () => {}