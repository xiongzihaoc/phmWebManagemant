<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>疾病方案</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="disTypeSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="disTypeSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加食物按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addFood">添加疾病方案</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="disPlanList"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="diseaseTypeName" label="类型" width="100"></el-table-column>
        <el-table-column align="center" prop="foodPlanName" label="饮食方案"></el-table-column>
        <el-table-column align="center" prop="waterPlanName" label="饮水方案"></el-table-column>
        <el-table-column align="center" prop="sportPlanName" label="运动方案"></el-table-column>
        <el-table-column align="center" prop="description" label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangev"
        :current-page="pageNum"
        :page-sizes="[10, 20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改页面 -->
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editForm" ref="editFormRef" @closed="editDialogClosed" label-width="80px">
        <el-form-item label="疾病名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="疾病类型" prop="diseaseTypeId">
          <el-select v-model="editForm.diseaseTypeId" placeholder="请选择">
            <el-option
              v-for="item in disTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="饮食方案" prop="foodPlanId">
          <el-select v-model="editForm.foodPlanId" placeholder="请选择">
            <el-option
              v-for="item in foodPlanList"
              :key="item.id"
              :label="item.dsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="饮水方案" prop="waterPlanId">
          <el-select v-model="editForm.waterPlanId" placeholder="请选择">
            <el-option
              v-for="item in waterPlanList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运动方案" prop="addSportPlanIds">
          <el-select
            v-model="editForm.addSportPlanIds"
            :reserve-keyword="true"
            filterable
            multiple
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in sportsPlanList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10}"
            placeholder="请输入内容..."
            v-model="editForm.description"
          ></el-input>
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
      input: "",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogTitle: "",
      editDialogVisible: false,
      editForm: {
        name: "",
        diseaseTypeId: "",
        foodPlanId: "",
        waterPlanId: "",
        sportPlanIds: "",
        addSportPlanIds: [],
        description: ""
      },
      disPlanId: 0,
      value: "",
      currentRow: null,
      disPlanList: [],
      disTypeList: [],
      foodPlanList: [],
      waterPlanList: [],
      sportsPlanList: []
    };
  },

  created() {
    this.getDisPlanList();
    this.getDisTypeList();
    this.getFoodPlanList();
    this.getWaterPlanList();
    this.getSportsPlanList();
  },

  methods: {
    // 获取疾病方案列表
    async getDisPlanList() {
      const { data: res } = await this.$http.post(
        "disease/getPDiseaseList.do",
        {
          name: this.input,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      this.disPlanList = res.rows;
      this.total = res.total;
    },
    // 获取疾病类型
    async getDisTypeList() {
      const { data: res } = await this.$http.post(
        "disease/type/getPDiseaseTypeList.do",
        {}
      );
      this.disTypeList = res.rows;
    },

    async getFoodPlanList() {
      const { data: res } = await this.$http.post(
        "foodPlan/getPFoodPlanList.do",
        {}
      );
      this.foodPlanList = res.rows;
    },

    async getWaterPlanList() {
      const { data: res } = await this.$http.post(
        "water/plan/getPWaterPlanList.do",
        {}
      );
      this.waterPlanList = res.rows;
    },

    async getSportsPlanList() {
      const { data: res } = await this.$http.post(
        "sportPlan/getPSportPlanList.do",
        {}
      );
      this.sportsPlanList = res.rows;
    },

    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getDisPlanList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getDisPlanList();
    },
    // 添加
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
      const { data: res } = await this.$http.post("disease/delPDisease.do", {
        id: info
      });
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getDisPlanList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    // 修改
    showEditdialog(info) {
      this.dialogTitle = "修改";
      this.disPlanId = info.id;
      this.editForm = {
        ...this.editForm,
        ...info
      };
      this.editForm.addSportPlanIds = this.editForm.sportPlanIds
        .split(",")
        .filter(n => n)
        .map(n => Number(n));
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        let sportPlanIds = this.editForm.addSportPlanIds.join(",");
        if (this.dialogTitle == "修改") {
          httpUrl = "disease/updatePDisease.do";
          parm = {
            id: this.disPlanId,
            name: this.editForm.name,
            diseaseTypeId: this.editForm.diseaseTypeId,
            foodPlanId: this.editForm.foodPlanId,
            waterPlanId: this.editForm.waterPlanId,
            description: this.editForm.description,
            sportPlanIds: sportPlanIds
          };
        } else {
          httpUrl = "disease/savePDisease.do";
          parm = {
            name: this.editForm.name,
            diseaseTypeId: this.editForm.diseaseTypeId,
            foodPlanId: this.editForm.foodPlanId,
            waterPlanId: this.editForm.waterPlanId,
            description: this.editForm.description,
            sportPlanIds: sportPlanIds
          };
        }
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getDisPlanList();
        this.editDialogVisible = false;
      });
    },
    addFood() {
      this.dialogTitle = "新增";
      this.editForm = {};
      this.editDialogVisible = true;
    },
    // 搜索
    disTypeSearch() {
      this.getDisPlanList();
    },
    // 实现表格单行选择高亮
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 10px;
}

.el-table {
  margin-top: 10px;
}

.diseaseDes {
  display: block;
  height: 100px;
}

.button_status {
  margin-top: 10px;
}
</style>