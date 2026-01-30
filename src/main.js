import { initVue } from '@/app/app.commom'
import './uni.promisify.adaptor'
import App from '@/App.vue';
import Vue from 'vue'

initVue(Vue);

const app = new App();

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
import { router, RouterMount } from '@/route'
console.log('router',router)
Vue.use(router); RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif

console.warn = () => {}
console.warn = () => {}