// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MyTable from './components/MyTable'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入样式重置css
import "./assets/css/reset.css"

// 引入封装的axios
import http from "./utils/http"
import store from "./store"
import API from "./API"
import qs from "qs"
Vue.use(ElementUI);
Vue.config.productionTip = false
// 添加到原型上
Vue.prototype.$http = http;
Vue.prototype.$api = API;
Vue.prototype.$qs = qs;
Vue.prototype.$domain = "http://localhost:3000";
Vue.component("my-table",MyTable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
