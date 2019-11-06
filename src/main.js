import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// nprogress 导入
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入字体图表
import './assets/iconfont/iconfont.css'
// 导入axios
import axios from 'axios'
// 配置axios
axios.defaults.baseURL = 'http://192.168.3.30:8080/admin_manager_war_exploded/'
// axios请求拦截器
axios.interceptors.request.use(function (config) {
  Nprogress.start()
  return config
}, function (error) {
  console.log(error);
})
// axios响应拦截器
axios.interceptors.response.use(function(config){
  Nprogress.done()
  return config;
},function(error){
  console.log(error)
})
// 全局挂载axios this.$http调用即可
Vue.prototype.$http = axios

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')