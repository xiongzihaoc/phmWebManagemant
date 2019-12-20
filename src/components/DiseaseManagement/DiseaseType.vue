<template>
  <div>
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
          <el-button type="primary" @click="addFood">新增疾病种类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="foodList"
        tooltip-effect="dark"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="name" label="疾病名称"></el-table-column>
        <el-table-column align="center" prop="officeTagName" label="科室" width="100"></el-table-column>
        <el-table-column align="center" prop="description" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="160">
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
              @click="statusClick(scope.row)"
              :type="scope.row.status === 1 ? 'warning' : 'danger'"
            >{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="40%" v-dialogDrag>
      <el-form :model="editForm" ref="editFormRef" @closed="editDialogClosed" label-width="80px">
        <el-form-item label="种类名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属科室" prop="officeTagId">
          <el-select v-model="editForm.officeTagId" placeholder="请选择">
            <el-option
              v-for="item in officeList"
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
      foodList: [],
      input: "",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogTitle: "",
      editDialogVisible: false,
      editForm: {
        name: "",
        officeTagId: "",
        description: ""
      },
      statusTitle: "",
      disTypeId: 0,
      value: "",
      officeList: [],
      currentRow: null
    };
  },

  created() {
    this.getDictionaryOfficeList();
    this.getdisTypeList();
  },

  methods: {
    // 获取疾病类型列表
    async getdisTypeList() {
      const { data: res } = await this.$http.post(
        "disease/type/getPDiseaseTypeList.do",
        {
          name: this.input,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      this.foodList = res.rows;
      this.total = res.total;
    },
    // 科室列表
    async getDictionaryOfficeList() {
      const { data: res } = await this.$http.post(
        "disease/type/getOfficeList.do",
        {}
      );
      console.log(res);
      this.officeList = res.rows;
    },

    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getdisTypeList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getdisTypeList();
    },
    // 添加
    // 删除
    async statusClick(info) {
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
        return this.$message.info("取消");
      }
      const { data: res } = await this.$http.post(
        "disease/type/updatePDiseaseType.do",
        {
          id: info.id,
          status: info.status == 1 ? 0 : 1,
          name: info.name
        }
      );
      if (res.code == 200) {
        this.$message.success("修改成功");
        this.getdisTypeList();
      } else {
        this.$message.error("修改失败");
        return;
      }
    },
    // 修改
    showEditdialog(info) {
      // console.log(info);
      this.dialogTitle = "修改";
      this.disTypeId = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        let httpUrl = "";
        let parm = {};
        if (this.dialogTitle == "修改") {
          httpUrl = "disease/type/updatePDiseaseType.do";
          parm = {
            id: this.disTypeId,
            name: this.editForm.name,
            officeTagId: this.editForm.officeTagId,
            description: this.editForm.description
          };
        } else {
          httpUrl = "disease/type/savePDiseaseType.do";
          parm = {
            name: this.editForm.name,
            officeTagId: this.editForm.officeTagId,
            description: this.editForm.description
          };
        }
        console.log(parm);
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getdisTypeList();
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
      this.getdisTypeList();
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
</style>