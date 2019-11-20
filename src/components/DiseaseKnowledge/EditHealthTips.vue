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
        <el-form-item>
        <!-- 按钮区域 -->
        <el-upload
          class="upload-demo"
          :action="this.UPLOAD_IMG"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button  round type="primary">添加文字</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
        </el-form-item>
        <el-form-item>
        <!-- 按钮区域 -->
        <el-upload
          class="upload-demo"
          :action="this.UPLOAD_IMG"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button  round type="primary">添加图片</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
        </el-form-item>
        <el-form-item>
        <!-- 按钮区域 -->
        <el-upload
          class="upload-demo"
          :action="this.UPLOAD_IMG"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button  round type="primary">添加视频</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
        </el-form-item>

        <!-- <div id="addImgVidWd" v-for="(item,index) in addInfos" :key="index">
          <el-form-item v-if="item == 1">
            <el-upload
              class="upload-demo"
              :action="this.UPLOAD_IMG"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="item == 2">
            <el-upload></el-upload>
          </el-form-item>
          <el-form-item v-if="item == 0">
            <el-upload></el-upload>
          </el-form-item>
        </div> -->
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editform: {},
      imageUrl: "",
      infoId: null,
      addInfos: [],
      fileList:[]
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
    // // 添加图片
    // addImage() {},
    // // 添加视频
    // addVideo() {},
    // // 添加文字
    // addWord() {},
    addImgVidWd() {},
    // 提交表单信息
    handlePreview(){},
    handleRemove(){},
    beforeRemove(){},
    handleExceed(){},
    saveInfo() {},
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

.upload-demo {
  float: left;
  margin-left: 20px;
}
.saveInfoBtn {
  float: right;
  margin-right: 30px;
}
</style>