<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/diseaseknowledge/healthKnowledge' }">健康小知识</el-breadcrumb-item>
      <el-breadcrumb-item>健康小知识修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-form ref="form" :model="editform" label-width="80px">
        <el-form-item label="文章名称">
          <el-input v-model="editform.name"></el-input>
        </el-form-item>
        <el-form-item label="疾病类型">
          <el-select v-model="editform.diseaseTypeValue" placeholder="请选择疾病类型"></el-select>
        </el-form-item>
        <el-form-item label="文本描述">
          <el-input
            :autosize="{ minRows: 5, maxRows: 10}"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editform.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章封面">
          <el-upload
            class="avatar-uploader"
            :action="this.UPLOAD_IMG"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addIMGDialog">添加图片</el-button>
      <div class="addIMGVID"></div>
    </el-card>
    <!-- 上传图片提示框 -->
    <el-dialog title="添加图片" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item label="上一级">
          
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editform: {},
      imageUrl: "",
      addForm:{
        ImgUrl:"",
      },
      infoId: null,
      resourcesList: [],
      addDialogVisible: false
    };
  },
  created() {
    this.infoId = this.$route.query.info.id;
    this.getEditHealthTipsList();
  },
  methods: {
    async getEditHealthTipsList() {
      const { data: res } = await this.$http.post(
        "healthKnowledge/getDetails.do",
        { id: this.infoId }
      );
      this.editform = res.data;
    },
    // 获取疾病种类
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
    // 添加图片
    addIMGDialog() {
      this.addDialogVisible = true
    },
    addImgVidWd() {},
    addEnter(){},
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data;
      // this.editForm.iconUrl = res.data;
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
.saveInfoBtn {
  float: right;
  margin-right: 30px;
}
.addIMGVID {
  width: 800px;
  height: 200px;
  background-color: pink;
}
</style>