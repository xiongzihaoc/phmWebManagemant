<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医院管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.enter.native="hospSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="hospSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="hosMenuList"
        :lazy="true"
        style="width: 100%;margin-bottom: 20px;"
        row-key="deptId"
        border
        stripe
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}">
        <el-table-column align="center" prop="deptName" label="名称" sortable ></el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序号" sortable ></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409167"
              inactive-color="#ccc"
              active-value="0"
              inactive-value="1"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row.acId)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 新增按钮 -->
            <el-button
              size="mini"
              @click="addDictionarybtn(scope.row.acId)"
              type="success"
              icon="el-icon-circle-plus"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      hosMenuList: []
    };
  },
  created() {
    this.getHosMenuList();
  },
  methods: {
    async getHosMenuList() {
      const { data: res } = await this.$http.post("dept/getDeptList.do",{});
      console.log(res);
      this.hosMenuList = res.data;
    },
    // 增加
    addDictionary() {},
    // 修改
    showEditdialog() {},
    // 改变状态按钮
    async userStateChanged(userinfo) {
      // const { data: res } = await this.$http.post("menu/updateSysMenu.do", {
      //   menuId: userinfo.menuId,
      //   code: userinfo.code
      // });
      // if (res.code != 200) {
      //   userinfo.code = !userinfo.code;
      //   return this.$message.error("更新用户状态失败");
      // } else {
      //   this.$message.success("更新用户状态成功");
      // }
    },
    // 搜索
    hospSearch() {},
    // 操作里面新增
    addDictionarybtn(){},
  }
};
</script>
<style lang='less' scoped>
</style>