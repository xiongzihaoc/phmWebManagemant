<template>
  <el-container class="container">
    <el-header>
      <div class="logo">
        <!-- <img src="../assets/heima.png" alt /> -->
        <span>卓亚科技</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div @click="isCollapse=!isCollapse" class="string">| | |</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="pink"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index=" '/' + item.id" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              @click="saveNavState(subItem.path)"
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 子组件占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        // id是key icon是值
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false,
      activePath: ""
    };
  },
//   created() {
//     this.getMenulist();
//     this.activePath = window.sessionStorage.getItem("activePath");
//   },
  methods: {
    logout() {
      this.$router.push("/login");
    },
    // async getMenulist() {
    //   const { data: res } = await this.$http.get("menus");
    //   if (res.meta.status != 200) return this.$message.error(res.meta.msg);
    //   this.menulist = res.data;
    //   // console.log(res);
    // },
    //保持链接的激活状态
    // saveNavState(activePath) {
    //   this.activePath = "/" + activePath;
    //   sessionStorage.setItem("activePath", "/" + activePath);
    // }
  }
};
</script>
<style lang='less' scoped>
.container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  color: #fff;
  align-items: center;
  padding-left: 0;
  > .logo {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgb(51, 55, 68);
}
.el-main {
  background-color: rgb(234, 237, 241);
}
.el-menu {
  border: none;
}
.iconfont {
  margin-right: 10px;
}
.string {
  cursor: pointer;
  color: #999;
  background-color: #373d41;
  text-align: center;
  font-size: 18px;
}
</style>