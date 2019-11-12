<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>饮水种类</el-breadcrumb-item>
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
      <el-table :data="waterList" stripe border style="width: 100%">
        <el-table-column align="center" type="selection" width="40"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" label="图标">
          <template slot-scope="scope">
            <img :src="scope.row.iconUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="description" label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改页面 -->
      <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="40%">
        <el-form :model="editForm" ref="editFormRef" label-width="80px" @closed="editDialogClosed">
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="iconUrl">
            <el-input v-model="editForm.iconUrl"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editEnter">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      waterList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      editDialogVisible: false,
      editForm: {
        name: "",
        iconUrl: "",
        description: ""
      },
      id: 0
    };
  },
  created() {
    this.getWaterList();
  },
  methods: {
    async getWaterList() {
      const { data: res } = await this.$http.post(
        "water/type/getPWaterTypeList.do",
        { pageSize: this.pageSize, pageNum: this.pageNum }
      );
      console.log(res);
      this.waterList = res.rows;
    },
    // 修改
    async showEditdialog(info) {
      // this.id = info.id
      // const { data: res } = await this.$http.post("water/type/getPWaterTypeList.do",{id:this.id});
      // if ()
      this.editForm = info;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editEnter() {
      const { data:res } = this.$http.post("water/type/updatePWaterType.do", {
        id: this.id,
        name: this.editForm.name,
        iconUrl: this.editForm.iconUrl,
        description: this.editForm.description
      });
      console.log(res);
      
      if (res.status != 200) {
        return this.$message.error("修改失败");
      } else {
        this.$$message.success('修改成功')
        this.getWaterList()
        this.editDialogVisible = false;
      }
    },
    // 删除
    removeUserById() {}
  }
};
</script>
<style lang='less' scoped>
</style>