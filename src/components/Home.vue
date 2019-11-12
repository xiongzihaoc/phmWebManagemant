<template>
  <!-- 容器 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'62px':'200px'">
      <!-- 侧边栏菜单区域 -->
      <el-menu
        background-color="#304156"
        text-color="#BFCBD9"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        :default-active="this.$route.path"
      >
        <!-- 一级菜单 -->
        <el-submenu :index="item.menuId + ''" v-for="item in menuList" :key="item.menuId">
          <template slot="title">
            <i :class="item.icon" height="24px"></i>
            <span>{{item.menuName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.url"
            v-for="subItem in item.child"
            :key="subItem.menuId"
            @click="saveNavState('/' + subItem.url)"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.menuName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="header_left">
          <i @click="toggleCollapse()" class="el-icon-s-fold" id="toggle"></i>
        </div>
        <div class="header_right" @click="logout()">
          <img src="../assets/images/header.gif" alt="退出" />
        </div>
      </el-header>
      <!-- 主体内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { get } from 'http';
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false,
      activePath:""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单栏数据
    async getMenuList() {
      const { data: res } = await this.$http.post("menu/getMenuList.do");
      if (res.status != 200) return this.$message.error(res.msg);
      this.menuList = res.data;
      // console.log(res);
    },
    // 是否折叠展架侧边栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保持连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
    },
  }
};
</script>
<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background: #304156;
}
.el-header {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.header_left {
  float: left;
  margin-top: 25px;
}
.header_left:hover {
  cursor: pointer;
}
.header_right {
  float: right;
  width: 40px;
  height: 40px;
  margin-top: 10px;
}
.header_right:hover {
  cursor: pointer;
}
.header_right img {
  float: left;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.el-menu {
  border-right: none;
}
#toggle {
  float: left;
}
#index {
  float: left;
  margin-left: 10px;
}
</style>