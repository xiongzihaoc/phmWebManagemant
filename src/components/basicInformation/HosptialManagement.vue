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
          <el-input placeholder="请输入内容" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="menuList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="menuId"
        border
        stripe
        default-expand-all
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      >
        <el-table-column  align="center" prop="menuName" label="名称" sortable width="180"></el-table-column>
        <el-table-column align="center" prop="menuType" label="菜单类型" sortable width="180"></el-table-column>
        <el-table-column align="center" prop="url" label="路径"></el-table-column>
        <el-table-column align="center" prop="icon" label="样式"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序号"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row.acId)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeUserById(scope.row.acId)"
              type="danger"
              icon="el-icon-delete"
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
      menuList: []
    };
  },
  methods: {

  }
};
</script>
<style lang='less' scoped>
</style>