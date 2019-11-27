<template>
  <!-- 容器 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'62px':'200px'">
      <!-- 侧边栏菜单区域 -->

      <div class="logoDiv">
        <img
          :width="iswidth?'30px':'50px'"
          :height="isheight?'30px':'50px'"
          class="logoImg"
          src="../assets/images/logo.png"
          alt
        />
        <!-- <div class="logoTitle">卓亚科技</div> -->
      </div>
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
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <i :class="item.icon" height="24px"></i>
            <span>{{item.menuName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.url"
            v-for="subItem in item.child"
            :key="subItem.id"
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
      <el-header class="top">
        <div class="header_left">
          <i
            @click="toggleCollapse()"
            :class="isClass?'el-icon-s-unfold':'el-icon-s-fold'"
            id="toggle"
          ></i>
        </div>
        <div class="header_right">
          <img class="logoutImg" src="../assets/images/header.gif" alt />
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              admin
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { get } from "http";
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false,
      activePath: "",
      loginName: "",
      isClass: false,
      iswidth:false,
      isheight:false,
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    this.loginName = window.sessionStorage.getItem("loginName");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单栏数据
    async getMenuList() {
      const { data: res } = await this.$http.post("menu/getMenuList.do", {});
      if (res.code != 200) return this.$message.error(res.msg);
      this.menuList = res.data;
    },
    // 是否折叠展架侧边栏
    toggleCollapse() {
      this.isClass = !this.isClass;
      this.isCollapse = !this.isCollapse;
      this.iswidth = !this.iswidth
      this.isheight = !this.isheight
    },
    // 保持连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    },
    handleCommand(command) {}
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
  box-shadow: 0 4px 4px rgba(0, 21, 41, 0.08);
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
  width: 500px;
  height: 60px;
}
.el-dropdown {
  float: right;
  margin-top: 25px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #2c3e50;
}
.el-icon-arrow-down {
  font-size: 12px;
  color: #2c3e50;
}
.el-menu {
  border-right: none;
  transition: 0s linear;
}
#toggle {
  float: left;
}
#index {
  float: left;
  margin-left: 10px;
}
.el-breadcrumb {
  float: left;
  margin-left: 20px;
  margin-top: 26px;
}
.logoImg {
  float: left;
  border-radius: 10%;
  padding-left: 16px;
  margin-left: 50%;
  transform: translate(-50%);
}
.logoDiv {
  overflow: hidden;
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 30px;
  padding-top: 10px;
  color: #409eff;
  font-weight: 700;
}
.el-dropdown {
  display: block;
  float: right;
}
.logoutImg {
  float: left;
  margin-left: 390px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 10px;
}
.logoTitle {
  float: left;
}
</style>