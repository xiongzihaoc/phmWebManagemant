<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>健康小知识</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @keyup.13.native="foodUnitSearch" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click="foodUnitSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="jumpAddHealthTips">新增</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :header-cell-style="{background:'#f5f5f5'}"
        :data="healthList"
        stripe
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="diseaseTypeValue" label="疾病类型"></el-table-column>
        <el-table-column align="center" prop="description" label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
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
      healthList: [],
      editDialogVisible: false,
      editForm: {
        fuUnit: "",
        fuWeight: ""
      },
      id: 0,
      dialogTitle: ""
    };
  },
  created() {
    this.getHealthList();
  },
  methods: {
    async getHealthList() {
      const { data: res } = await this.$http.post(
        "healthKnowledge/getPHealthKnowledgeList.do",
        { type: 1, name: this.input }
      );
      this.healthList = res.rows;
    },
    // 修改
    showEditdialog(info) {
      this.$router.push({
        path: "/diseaseknowledge/EditHealthTips",
        query: { info }
      });
    },
    // 搜索
    foodUnitSearch() {
      this.getHealthList();
    },
    // 删除
    async removeUserById(info) {
      const confirmResult = await this.$confirm(
        "你确定要执行此操作, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => console.log(err));
      if (confirmResult != "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.post(
        "healthKnowledge/delPHealthKnowledge.do",
        {
          id: info
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getHealthList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    jumpAddHealthTips(info) {
      this.$router.push({ path: "/diseaseknowledge/AddHealthTips" });
    }
  }
};
</script>
<style lang='less' scoped>
</style>