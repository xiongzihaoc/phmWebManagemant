import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import Router from 'vue-router'
Vue.use(Vuex)
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 应用初始状态
const state = {
  options: [],
  activeIndex: '/'
}

// 定义所需的 mutations
const mutations = {
  // 添加tabs
  add_tabs(state, data) {
    this.state.options.push(data);
  },
  // 删除tabs
  delete_tabs(state, route) {
    let index = 0;
    for (let option of state.options) {
      if (option.route === route) {
        break;
      }
      index++;
    }
    this.state.options.splice(index, 1);
  },
  // 设置当前激活的tab
  set_active_index(state, index) {
    this.state.activeIndex = index;
  }
}

// 创建 store 实例
export default new Vuex.Store({
  state,
  router,
  mutations
})