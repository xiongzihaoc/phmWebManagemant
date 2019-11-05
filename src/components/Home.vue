<template>
  <!-- 容器 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <!-- 侧边栏菜单区域 -->
      <el-menu background-color="#304156" text-color="#BFCBD9">
        <!-- 一级菜单 -->
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="header_left">
          <h1>back-stage management</h1>
        </div>
        <div class="header_right" @click="logout()">
          <img src="../assets/header.gif" />
        </div>
      </el-header>
      <!-- 主体内容区域 -->
      <el-main>
        <h1>Main</h1>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    // this.getMenuList();
  },
  methods: {
    logout() {
      this.$message.success("退出成功");
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menu/getMenuList.do");
      console.log(res);
    }
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
  margin-top: 20px;
}
.header_right {
  float: right;
  width: 40px;
  height: 40px;
  margin-top: 10px;
}
.header_right img {
  float: left;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

</style>