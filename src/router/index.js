import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Index from '../components/Index.vue'
import MenuManagemant from '../components/basicInformation/MenuManagemant.vue'
import DoctorManagement from '../components/basicInformation/DoctorManagement.vue'
import SystemAccount from '../components/basicInformation/SystemAccount.vue'
import HosptialManagement from '../components/basicInformation/HosptialManagement.vue'
import Dictionary from '../components/basicInformation/Dictionary.vue'
import UserManagemant from '../components/basicInformation/UserManagemant.vue'
import FoodManagement from '../components/dietaryManagement/FoodManagement.vue'
import DietPlan from '../components/dietaryManagement/DietPlan.vue'
import MovementPlan from '../components/sportManagement/MovementPlan.vue'
import WaterSolution from '../components/waterManagement/WaterSolution.vue'
import WaterType from '../components/waterManagement/WaterType.vue'
Vue.use(VueRouter)

const routes = [{path: '/',redirect: '/login'},
  {path: '/login',component: Login},
  {path: '/home',component: Home,redirect: '/index',children: [
    { path: '/index',component: Index},
    { path: '/system/menu',component: MenuManagemant},
    { path: '/system/user',component: SystemAccount},
    { path: '/system/doctor',component: DoctorManagement},
    { path: '/system/hosptial',component: HosptialManagement},
    { path: '/system/dict',component: Dictionary},
    { path: '/system/patient',component: UserManagemant},
    { path: '/food/foodManagemant',component: FoodManagement},
    { path: '/food/DietPlan',component: DietPlan},
    { path: '/sport/MovementPlan',component: MovementPlan},
    { path: '/water/WaterSolution',component: WaterSolution},
    { path: '/water/WaterType',component: WaterType},
  ]
  },
]

const router = new VueRouter({
  routes
})
export default router