<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>食物管理</el-breadcrumb-item>
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
          <el-button type="primary">添加食物</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="foodList" stripe border style="width: 100%">
        <el-table-column align="center" type="selection" width="40"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="fdName" label="名称"></el-table-column>
        <el-table-column align="center" label="图标">
          <template slot-scope="scope">
            <img :src="scope.row.fdPhotoPath" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fdTypeValue" label="类型"></el-table-column>
        <el-table-column align="center" prop="elementName" label="元素名称"></el-table-column>
        <!-- <el-table-column prop="address" label="描述"></el-table-column> -->
        <el-table-column align="center" prop="operate" label="操作" width="160">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button @click="showEditdialog(scope.row)" type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改页面 -->
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="40%">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      foodList: [],
      input: "",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      editDialogVisible: false
    };
  },

  created() {
    this.getFoodList();
  },

  methods: {
    // 获取用户列表
    async getFoodList() {
      const { data: res } = await this.$http.post("food/getPFoodList.do", {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      console.log(res);
      if (res.code != 200) return this.$message.error("数获取失败");
      this.foodList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getFoodList();
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
      this.getFoodList();
    },
    // 修改
    showEditdialog(info) {
      console.log(info);
      this.editDialogVisible = true;
    },
    edit() {
      this.editDialogVisible = false;
    },
    // 删除
    removeUserById(id) {
      console.log(id);
      
    }
  }
};
</script>
<style lang='less' scoped>
</style>