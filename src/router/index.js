import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Index from '../components/Index.vue'
import DoctorManagement from '../components/basic information/DoctorManagement.vue'
Vue.use(VueRouter)

const routes = [{path: '/',redirect: '/login'},
  {path: '/login',component: Login},
  {path: '/home',component: Home,redirect: '/index',children: [
    { path: '/index',component: Index},
    { path: '/user/userList.do',component: DoctorManagement},
  ]
  },
]

const router = new VueRouter({
  routes
})

export default router