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
          <el-button type="primary" @click="addWater">添加饮水</el-button>
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
      <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="40%">
        <el-form :model="editForm" ref="editFormRef" label-width="80px" @closed="editDialogClosed">
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="iconUrl">
            <el-upload
              class="avatar-uploader"
              action="http://192.168.3.30:8080/zhuoya_manager/oss/fileUpload.do"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
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
      id: 0,
      dialogTitle: "",
      imageUrl: ""
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
      console.log(res.rows);
      this.waterList = res.rows;
      console.log(this.waterList);
    },
    // 修改
    async showEditdialog(info) {
      this.dialogTitle = "修改";
      this.id = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.imageUrl = "";
      this.$refs.editFormRef.resetFields();
    },
    async editEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.dialogTitle == "修改") {
        httpUrl = "water/type/updatePWaterType.do";
        parm = {
          id: this.id,
          name: this.editForm.name,
          iconUrl: this.editForm.iconUrl,
          description: this.editForm.description
        };
      } else {
        httpUrl = "water/type/savePWaterType.do";
        parm = {
          name: this.editForm.name,
          iconUrl: this.editForm.iconUrl,
          description: this.editForm.description
        };
      }
      const { data: res } = await this.$http.post(httpUrl, parm);
      if (res.status != 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      this.getWaterList();
      this.editDialogVisible = false;
    },
    // 删除
    removeUserById() {},
    addWater() {
      this.dialogTitle = "新增";
      this.editForm = {};
      this.editDialogVisible = true;
    },

    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = res.data;
      this.editForm.iconUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.common.errorTip("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.common.errorTip("上传图片大小不能超过 2MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
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