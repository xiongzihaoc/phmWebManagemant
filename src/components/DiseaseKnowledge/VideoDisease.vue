<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>疾病轮播图</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @keyup.13.native="WaterSearch" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click="ImgSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addImg">新增轮播图</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        tooltip-effect="dark"
        :data="VideoDiseaseList"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="封面" width="60"></el-table-column>
        <el-table-column align="center" prop="fmName" label="类型"></el-table-column>
        <el-table-column align="center" label="网页地址"></el-table-column>
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
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangev"
        :current-page="pageNum"
        :page-sizes="[10, 20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 修改页面 -->
      <el-dialog
        title="修改"
        :visible.sync="editDialogVisible"
        width="40%"
        @closed="editDialogClosed"
      >
        <!-- <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="名称" prop="fmName">
            <el-input v-model="editForm.fmName"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="fmPhotoPath"></el-form-item>
          <el-form-item label="类型" prop="fmType">
            <el-select v-model="editForm.fmType" placeholder="请选择">
              <el-option
                v-for="item in EstimateTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重量" prop="fmWeight">
            <el-input v-model="editForm.fmWeight"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="fmDescribe">
            <el-input v-model="editForm.fmDescribe"></el-input>
          </el-form-item>
        </el-form>-->
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
      editDialogVisible: false,
      editForm: {},
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getInfoList();
  },
  methods: {
    // 获取列表
    async getInfoList() {
      const { data: res } = await this.$http.post(
        "disease/banner/getDiseaseBannerList.do",
        { pageSize: this.pageSize, pageNum: this.pageNum }
      );
      console.log(res);
    },
    // 新增轮播图
    addImg() {},
    // 确定修改
    editEnter() {},
    // 搜索
    ImgSearch() {},
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getWaterTypeList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getWaterTypeList();
    }
  }
};
</script>
<style lang='less' scoped>
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar {
  width: 60px;
  height: 80px;
  display: block;
}
</style>