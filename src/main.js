import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图表
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false
// // 配置axios
// import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// // vue原型对象上添加axios这样全部组件 this.$http调用即可
// Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
