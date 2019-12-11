import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
    redirect: '/index',
    children: [{
        path: '/index',
        name: "首页",
        component: () => import('@/components/Index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/system/menu',
        name: "菜单管理",
        component: () => import('@/components/basicInformation/MenuManagemant.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/system/user',
        name: "系统账户",
        component: () => import('@/components/basicInformation/SystemAccount.vue'),
        meta: {
          title: '系统账户'
        }
      },
      {
        path: '/system/UserList',
        name: "用户管理",
        component: () => import('@/components/basicInformation/UserManagemant.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/system/doctor',
        name: "医生管理",
        component: () => import('@/components/basicInformation/DoctorManagement.vue'),
        meta: {
          title: '医生管理'
        }
      },
      {
        path: '/system/hosptial',
        name: "医院管理",
        component: () => import('@/components/basicInformation/HosptialManagement.vue'),
        meta: {
          title: '医院管理'
        }
      },
      {
        path: '/system/dict',
        name: "数据字典",
        component: () => import('@/components/basicInformation/Dictionary.vue'),
        meta: {
          title: '数据字典'
        }
      },
      {
        path: '/system/patient',
        name: "患者管理",
        component: () => import('@/components/basicInformation/PatientManagement.vue'),
        meta: {
          title: '患者管理'
        }
      },
      {
        path: '/system/role',
        name: "角色管理",
        component: () => import('@/components/basicInformation/Role.vue'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/system/log',
        name: "日志管理",
        component: () => import('@/components/basicInformation/Logmanagemant.vue'),
        meta: {
          title: '日志管理'
        }
      },
      {
        path: '/JumpDictionaryNext',
        name: "字典数据",
        component: () => import('@/components/basicInformation/JumpDictionaryNext.vue'),
        meta: {
          title: '字典数据'
        }
      },
      {
        path: '/system/server',
        name: "服务器监控",
        component: () => import('@/components/basicInformation/ServerMonitoring.vue'),
        meta: {
          title: '服务器监控'
        }
      },
      {
        path: '/system/test',
        name: "测试页面",
        component: () => import('@/components/basicInformation/Test.vue'),
        meta: {
          title: '测试页面'
        }
      },
      {
        path: '/food/foodManagemant',
        name: "食物管理",
        component: () => import('@/components/dietaryManagement/FoodManagement.vue'),
        meta: {
          title: '食物管理'
        }
      },
      {
        path: '/food/DietPlan',
        name: "饮食方案",
        component: () => import('@/components/dietaryManagement/DietPlan.vue'),
        meta: {
          title: '饮食方案'
        }
      },
      {
        path: '/food/measure',
        name: "估量食物管理",
        component: () => import('@/components/dietaryManagement/EstimateFood.vue'),
        meta: {
          title: '估量食物管理'
        }
      },
      {
        path: '/food/measuretype',
        name: "估量食物类型管理",
        component: () => import('@/components/dietaryManagement/EstimateFoodManagemant.vue'),
        meta: {
          title: '估量食物类型管理'
        }
      },
      {
        path: '/food/foodType',
        name: "食物类型管理",
        component: () => import('@/components/dietaryManagement/FoodType.vue'),
        meta: {
          title: '食物类型管理'
        }
      },
      {
        path: '/food/Microelement',
        name: "微量元素",
        component: () => import('@/components/microelement/Microelement.vue'),
        meta: {
          title: '微量元素'
        }
      },
      {
        path: '/food/Units',
        name: "食物单位",
        component: () => import('@/components/dietaryManagement/FoodUnits.vue'),
        meta: {
          title: '食物单位'
        }
      },
      {
        path: '/food/ElementList',
        name: "元素列表",
        component: () => import('@/components/dietaryManagement/ElementList.vue'),
        meta: {
          title: '元素列表'
        }
      },
      {
        path: '/water/WaterDrinkingDetail',
        name: "饮水指导详情",
        component: () => import('@/components/waterManagement/WaterDrinkingDetail.vue'),
        meta: {
          title: '饮水指导详情'
        }
      },
      {
        path: '/sport/MovementPlan',
        name: "运动方案",
        component: () => import('@/components/sportManagement/MovementPlan.vue'),
        meta: {
          title: '运动方案'
        }
      },
      {
        path: '/sport/MovementIntroduced',
        name: "运动介绍",
        component: () => import('@/components/sportManagement/MovementIntroduced.vue'),
        meta: {
          title: '运动介绍'
        }
      },
      {
        path: '/water/WaterSolution',
        name: "饮水方案",
        component: () => import('@/components/waterManagement/WaterSolution.vue'),
        meta: {
          title: '饮水方案'
        }
      },
      {
        path: '/water/WaterType',
        name: "饮水种类",
        component: () => import('@/components/waterManagement/WaterType.vue'),
        meta: {
          title: '饮水种类'
        }
      },{
        path: '/water/guide',
        name: "饮水指导",
        component: () => import('@/components/waterManagement/WaterDrinking.vue'),
        meta: {
          title: '饮水指导'
        }
      },
      {
        path: '/illness/case',
        name: "疾病方案",
        component: () => import('@/components/DiseaseManagement/DiseaseScheme.vue'),
        meta: {
          title: '疾病方案'
        }
      },
      {
        path: '/illness/type',
        name: "疾病类型",
        component: () => import('@/components/DiseaseManagement/DiseaseType.vue'),
        meta: {
          title: '疾病类型'
        }
      },
      {

        path: '/diseaseknowledge/nursingInstruction',
        name: "护理指导",
        component: () => import('@/components/DiseaseKnowledge/NursingInstruction.vue'),
        meta: {
          title: '护理指导'
        }
      },
      {
        path: '/diseaseknowledge/EditNursingInstruction',
        name: "护理指导修改",
        component: () => import('@/components/DiseaseKnowledge/EditNursingInstruction.vue'),
        meta: {
          title: '护理指导修改'
        }
      },
      {
        path: '/diseaseknowledge/AddNursingInstruction',
        name: "护理指导增加",
        component: () => import('@/components/DiseaseKnowledge/AddNursingInstruction.vue'),
        meta: {
          title: '护理指导增加'
        }
      },
      {
        path: '/diseaseknowledge/healthKnowledge',
        name: "健康小知识",
        component: () => import('@/components/DiseaseKnowledge/HealthTips.vue'),
        meta: {
          title: '健康小知识'
        }
      },
      {
        path: '/diseaseknowledge/EditHealthTips',
        name: "健康小知识修改",
        component: () => import('@/components/DiseaseKnowledge/EditHealthTips.vue'),
        meta: {
          title: '健康小知识修改'
        }
      },
      {
        path: '/diseaseknowledge/AddHealthTips',
        name: "健康小知识增加",
        component: () => import('@/components/DiseaseKnowledge/AddHealthTips.vue'),
        meta: {
          title: '健康小知识增加'
        }
      },
      {
        path: '/VideoDisease',
        name: "疾病轮播图",
        component: () => import('@/components/DiseaseKnowledge/VideoDisease.vue'),
        meta: {
          title: '疾病轮播图'
        }
      },
      {
        path: '/Health/inquiry',
        name: "轻问诊记录",
        component: () => import('@/components/HealthManagemant/EasyInquiry.vue'),
        meta: {
          title: '轻问诊记录'
        }
      },
    ]
  },
]

const router = new VueRouter({
  // baseL: "/history",
  // mode: 'history',
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