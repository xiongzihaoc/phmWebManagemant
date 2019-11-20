<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/food/foodManagemant' }">食物管理</el-breadcrumb-item>
      <el-breadcrumb-item>微量元素</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @keyup.13.native="microSearch" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click="microSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addWater">添加元素</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :header-cell-style="{background:'#f5f5f5'}"
        :data="FoodEleList"
        stripe
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="miName" label="元素名称"></el-table-column>
        <el-table-column align="center" prop="miUnit" label="元素单位"></el-table-column>
        <el-table-column align="center" prop="miValue" label="元素值"></el-table-column>
        <el-table-column align="center" prop="miDescribe" label="描述"></el-table-column>
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
              @click="removeUserById(scope.row)"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改页面 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="editDialogVisible"
        width="40%"
        @closed="editDialogClosed"
      >
        <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="元素名称" prop="miName">
            <el-select v-model="editForm.miName" placeholder="请选择">
              <el-option
                v-for="item in eleNameList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="元素单位" prop="miUnit">
            <el-select v-model="editForm.miUnit" placeholder="请选择">
              <el-option
                v-for="item in eleUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="元素值" prop="miValue">
            <el-input v-model="editForm.miValue"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="miDescribe">
            <el-input v-model="editForm.miDescribe"></el-input>
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
      FoodEleList: [],
      eleNameList: [],
      eleUnitList: [],
      editDialogVisible: false,
      editForm: {
        miName: "",
        miValue: "",
        miUnit: "",
        miDescribe: ""
      },
      id: 0,
      foodId: null,
      dialogTitle: ""
    };
  },
  created() {
    this.foodId = this.$route.query.id;
    this.getMicroList();
    this.getDictionaryEleList();
    this.getDictionaryUnitList();
  },
  methods: {
    // 数据字典元素名称列表
    async getDictionaryEleList() {
      const { data: res } = await this.$http.post(
        "sys/dict/getPreviewData.do",
        { dictValue: "food_element" }
      );
      this.eleNameList = res.data;
    },
    // 数据字典元素单位列表
    async getDictionaryUnitList() {
      const { data: res } = await this.$http.post(
        "sys/dict/getPreviewData.do",
        { dictValue: "element" }
      );
      this.eleUnitList = res.data;
    },
    // 微量元素列表
    async getMicroList() {
      const { data: res } = await this.$http.post(
        "foodElement/getPFoodElementList.do",
        { foodId: this.foodId, name: this.input }
      );
      console.log(res);
      this.FoodEleList = res.rows;
      this.total = res.total;
    },
    // 修改
    showEditdialog(info) {
      this.dialogTitle = "修改";
      this.id = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async editEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.dialogTitle == "修改") {
        httpUrl = "foodElement/updatePFoodElement.do";
        parm = {
          id: this.id,
          foodId: this.foodId,
          miName: this.editForm.miName,
          miValue: this.editForm.miValue,
          miUnit: this.editForm.miUnit,
          miDescribe: this.editForm.miDescribe
        };
      } else {
        httpUrl = "foodElement/savePFoodElement.do";
        parm = {
          foodId: this.foodId,
          miName: this.editForm.miName,
          miValue: this.editForm.miValue,
          miUnit: this.editForm.miUnit,
          miDescribe: this.editForm.miDescribe
        };
      }
      const { data: res } = await this.$http.post(httpUrl, parm);
      if (res.code != 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      this.getMicroList();
      this.editDialogVisible = false;
    },
    // 搜索
    microSearch() {
      this.getMicroList();
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
        "foodElement/delPFoodElement.do",
        {
          id: info.id
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getMicroList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    addWater() {
      this.dialogTitle = "新增";
      this.editForm = {};
      this.editDialogVisible = true;
    }
  }
};
</script>
<style lang='less' scoped>
</style>