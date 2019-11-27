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
import PatientManagement from '../components/basicInformation/PatientManagement.vue'
import Role from '../components/basicInformation/Role.vue'
import Logmanagemant from '../components/basicInformation/Logmanagemant.vue'
import ServerMonitoring from '../components/basicInformation/ServerMonitoring.vue'
import FoodManagement from '../components/dietaryManagement/FoodManagement.vue'
import DietPlan from '../components/dietaryManagement/DietPlan.vue'
import EstimateFood from '../components/dietaryManagement/EstimateFood.vue'
import EstimateFoodManagemant from '../components/dietaryManagement/EstimateFoodManagemant.vue'
import FoodUnits from '../components/dietaryManagement/FoodUnits.vue'
import MovementPlan from '../components/sportManagement/MovementPlan.vue'
import WaterSolution from '../components/waterManagement/WaterSolution.vue'
import WaterType from '../components/waterManagement/WaterType.vue'
import DiseaseScheme from '../components/DiseaseManagement/DiseaseScheme.vue'
import FoodType from '../components/dietaryManagement/FoodType.vue'
import Microelement from '../components/microelement/Microelement.vue'
import NursingInstruction from '../components/DiseaseKnowledge/NursingInstruction.vue'
import EditNursingInstruction from '../components/DiseaseKnowledge/EditNursingInstruction.vue'
import AddNursingInstruction from '../components/DiseaseKnowledge/AddNursingInstruction.vue'
import HealthTips from '../components/DiseaseKnowledge/HealthTips.vue'
import EditHealthTips from '../components/DiseaseKnowledge/EditHealthTips.vue'
import AddHealthTips from '../components/DiseaseKnowledge/AddHealthTips.vue'
import JumpDictionaryNext from '../components/basicInformation/JumpDictionaryNext.vue'
import ElementList from '../components/dietaryManagement/ElementList.vue'
import DiseaseType from '../components/DiseaseManagement/DiseaseType.vue'
import EasyInquiry from '../components/HealthManagemant/EasyInquiry.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/index',
    children: [{
        path: '/index',
        name: "首页",
        component: Index,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/system/menu',
        name: "菜单管理",
        component: MenuManagemant,
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/system/user',
        name: "系统账户",
        component: SystemAccount,
        meta: {
          title: '系统账户'
        }
      },
      {
        path: '/system/UserList',
        name: "用户管理",
        component: UserManagemant,
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/system/doctor',
        name: "医生管理",
        component: DoctorManagement,
        meta: {
          title: '医生管理'
        }
      },
      {
        path: '/system/hosptial',
        name: "医院管理",
        component: HosptialManagement,
        meta: {
          title: '医院管理'
        }
      },
      {
        path: '/system/dict',
        name: "数据字典",
        component: Dictionary,
        meta: {
          title: '数据字典'
        }
      },
      {
        path: '/system/patient',
        name: "患者管理",
        component: PatientManagement,
        meta: {
          title: '患者管理'
        }
      },
      {
        path: '/system/role',
        name: "角色管理",
        component: Role,
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/system/log',
        name: "日志管理",
        component: Logmanagemant,
        meta: {
          title: '日志管理'
        }
      },
      {
        path: '/JumpDictionaryNext',
        name: "字典数据",
        component: JumpDictionaryNext,
        meta: {
          title: '字典数据'
        }
      },
      {
        path: '/system/server',
        name: "服务器监控",
        component: ServerMonitoring,
        meta: {
          title: '服务器监控'
        }
      },
      {
        path: '/food/foodManagemant',
        name: "食物管理",
        component: FoodManagement,
        meta: {
          title: '食物管理'
        }
      },
      {
        path: '/food/DietPlan',
        name: "饮食方案",
        component: DietPlan,
        meta: {
          title: '饮食方案'
        }
      },
      {
        path: '/food/measure',
        name: "估量食物管理",
        component: EstimateFood,
        meta: {
          title: '估量食物管理'
        }
      },
      {
        path: '/food/measuretype',
        name: "估量食物类型管理",
        component: EstimateFoodManagemant,
        meta: {
          title: '估量食物类型管理'
        }
      },
      {
        path: '/food/foodType',
        name: "食物类型管理",
        component: FoodType,
        meta: {
          title: '食物类型管理'
        }
      },
      {
        path: '/food/Microelement',
        name: "微量元素",
        component: Microelement,
        meta: {
          title: '微量元素'
        }
      },
      {
        path: '/food/Units',
        name: "食物单位",
        component: FoodUnits,
        meta: {
          title: '食物单位'
        }
      },
      {
        path: '/food/ElementList',
        name: "元素列表",
        component: ElementList,
        meta: {
          title: '元素列表'
        }
      },
      {
        path: '/sport/MovementPlan',
        name: "运动方案",
        component: MovementPlan,
        meta: {
          title: '运动方案'
        }
      },
      {
        path: '/water/WaterSolution',
        name: "饮水方案",
        component: WaterSolution,
        meta: {
          title: '饮水方案'
        }
      },
      {
        path: '/water/WaterType',
        name: "饮水种类",
        component: WaterType,
        meta: {
          title: '饮水种类'
        }
      },
      {
        path: '/illness/case',
        name: "疾病方案",
        component: DiseaseScheme,
        meta: {
          title: '疾病方案'
        }
      },
      {
        path: '/illness/type',
        name: "疾病类型",
        component: DiseaseType,
        meta: {
          title: '疾病类型'
        }
      },
      {
        path: '/diseaseknowledge/nursingInstruction',
        name: "护理指导",
        component: NursingInstruction,
        meta: {
          title: '护理指导'
        }
      },
      {
        path: '/diseaseknowledge/EditNursingInstruction',
        name: "护理指导修改",
        component: EditNursingInstruction,
        meta: {
          title: '护理指导修改'
        }
      },
      {
        path: '/diseaseknowledge/AddNursingInstruction',
        name: "护理指导增加",
        component: AddNursingInstruction,
        meta: {
          title: '护理指导增加'
        }
      },
      {
        path: '/diseaseknowledge/healthKnowledge',
        name: "健康小知识",
        component: HealthTips,
        meta: {
          title: '健康小知识'
        }
      },
      {
        path: '/diseaseknowledge/EditHealthTips',
        name: "健康小知识修改",
        component: EditHealthTips,
        meta: {
          title: '健康小知识修改'
        }
      },
      {
        path: '/diseaseknowledge/AddHealthTips',
        name: "健康小知识增加",
        component: AddHealthTips,
        meta: {
          title: '健康小知识增加'
        }
      },
      {
        path: '/Health/inquiry',
        name: "轻问诊记录",
        component: EasyInquiry,
        meta: {
          title: '轻问诊记录'
        }
      },
    ]
  },
]
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  //如果用户访问的路由是/login直接放行
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  //如果没有买票，让他去/login买票去
  if (!tokenStr) return next('/login');
  next();
})
export default router