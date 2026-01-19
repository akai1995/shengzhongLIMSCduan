import { initVue } from '@/app/app.commom'
import './uni.promisify.adaptor'
import App from '@/App.vue';
import Vue from 'vue'

initVue(Vue);

const app = new App();

app.$mount(); 