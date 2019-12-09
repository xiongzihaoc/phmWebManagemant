<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/diseaseknowledge/nursingInstruction'}">护理指导</el-breadcrumb-item>
      <el-breadcrumb-item>护理指导修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-form ref="editFormRef" :model="editform" label-width="80px">
        <el-form-item label="文章名称">
          <el-input v-model="editform.name"></el-input>
        </el-form-item>
        <el-form-item label="疾病类型">
          <el-select v-model="editform.diseaseTypeId" placeholder="请选择疾病类型">
            <el-option
              v-for="item in healthList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
            :on-success="handleAvatarSuccessSM"
            :on-progress="uploadArtImgProcess"
            :before-upload="beforeAvatarUploadSM"
          >
            <img v-if="editform.articleImagesUrl" :src="editform.articleImagesUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-progress
            v-if="artImgFlag == true"
            :percentage="percentageFile"
            style="margin-top:10px;width:120px;"
          ></el-progress>
        </el-form-item>
      </el-form>
      <!-- 拖拽区域 -->
      <el-card class="draggableCard" v-show="addInfos.length>0">
        <div id="changePositionBox">
          <span class="PosTit" style="font-weight:700">调整顺序</span>
          <div class="draggableCon">
            <vuedraggable v-model="addInfos">
              <transition-group tag="p">
                <div v-for="(item,index) in addInfos" v-bind:key="index">
                  <div
                    class="draggableDiv draggableDivFirst"
                    v-if="item.type==0"
                  >{{item.textDescription}}</div>
                  <div class="draggableDiv" v-if="item.type==1">
                    <img :src="item.imageUrl" alt width="140" height="140" />
                  </div>
                  <div class="draggableDiv" v-if="item.type==2">
                    <video :src="item.videoUrl" width="140" height="140" controls></video>
                  </div>
                </div>
              </transition-group>
            </vuedraggable>
          </div>
        </div>
      </el-card>
      <ul class="addImgVid" v-for="item in addInfos" :key="item.id">
        <li class="addChild" v-if="item.type==0">
          <textarea class="txtClass" placeholder="请输入内容" v-model="item.textDescription"></textarea>
          <img
            src="../../assets/images/deleteItem.png"
            @click="infoDelete(item.id)"
            class="el-icon-error closeTxt"
          />
        </li>
        <li class="addChild" v-if="item.type==1">
          <img class="impImg" :src="item.imageUrl" alt />
          <img
            src="../../assets/images/deleteItem.png"
            @click="infoDelete(item.id)"
            class="el-icon-error closeImg"
          />
        </li>
        <li class="addChild" v-if="item.type==2">
          <video class="addVideo" :src="item.videoUrl" controls :poster="item.imageUrl"></video>
          <img
            src="../../assets/images/deleteItem.png"
            @click="infoDelete(item.id)"
            class="el-icon-error closeVideo"
          />
        </li>
      </ul>
      <div style="overflow:hidden;">
        <el-button class="addBTN offSetWord" type="primary" round @click="addWord">添加文字</el-button>
        <el-upload
          class="upload-demo"
          :action="this.UPLOAD_IMG"
          :on-success="handleAvatarSuccessImg"
          :on-progress="uploadImgProcess"
          :before-upload="beforeAvatarUploadImg"
          :show-file-list="false"
        >
          <el-button class="addBTN upImg" round type="primary">添加图片</el-button>
          <el-progress v-if="imgFlag == true" :percentage="percentageFile" style="margin-top:10px;"></el-progress>
        </el-upload>
        <el-upload
          class="upload-demo"
          :action="this.UPLOAD_IMG"
          :on-success="handleAvatarSuccessVid"
          :on-progress="uploadVidProcess"
          :before-upload="beforeAvatarUploadVid"
          :show-file-list="false"
        >
          <el-button class="addBTN upImg" round type="primary">添加视频</el-button>
          <el-progress
            v-if="videoFlag == true"
            :percentage="percentageFile"
            style="margin-top:10px;"
          ></el-progress>
        </el-upload>
        <el-button @click="saveInfo" type="success" class="saveInfo" round>保存修改</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";
export default {
  name: "EditNursingInstruction",
  components: { vuedraggable },
  data() {
    return {
      editform: {
        name: "",
        diseaseTypeId: "",
        description: "",
        diseaseTypeValue: "",
        articleImagesUrl: ""
      },
      healthList: [],
      imageUrl: "",
      infoId: null,
      illnessId: null,
      addInfos: [],
      ImgUrl: "",
      VidUrl: "",
      imgFlag: false,
      percentageFile: 0,
      videoFlag: false,
      artImgFlag: false
    };
  },
  created() {
    this.infoId = window.sessionStorage.getItem("editNursingInstruction");
    this.getEditHealthTipsList();
    this.getHealthList();
  },
  methods: {
    async getEditHealthTipsList() {
      const { data: res } = await this.$http.post(
        "healthKnowledge/getDetails.do",
        { id: this.infoId }
      );
      this.editform = res.data;
      this.illnessId = res.data.id;
      this.addInfos = res.data.resourcesList;
    },
    // 获取疾病类型
    async getHealthList() {
      const { data: res } = await this.$http.post(
        "disease/type/getPDiseaseTypeList.do",
        {}
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      this.foodList = res.rows;
      this.total = res.total;
      this.healthList = res.rows;
    },
    saveInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        const { data: res } = await this.$http.post(
          "healthKnowledge/updatePHealthKnowledge.do",
          {
            id: this.illnessId,
            name: this.editform.name,
            diseaseTypeId: this.editform.diseaseTypeId,
            description: this.editform.description,
            articleImagesUrl: this.editform.articleImagesUrl,
            type: 2,
            resourcesList: this.addInfos
          }
        );
        if (res.code != 200) {
          this.$message.error("保存失败");
          return;
        } else {
          this.$message.success("保存成功");
          this.$router.push("/diseaseknowledge/nursingInstruction");
        }
      });
    },
    // 文字修改
    addWord() {
      let objWord = {
        textDescription: "",
        type: 0
      };
      this.addInfos.push(objWord);
    },
    // 單個刪除
    infoDelete(info) {
      var arr = this.addInfos;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == info) {
          arr[i].ImgUrl = "";
          arr.splice(i, 1);
        }
      }
    },
    handleAvatarSuccessSM(res, file) {
      this.percentageFile = 0;
      this.artImgFlag = false;
      this.editform.articleImagesUrl = res.data;
    },
    uploadArtImgProcess(event, file, fileList) {
      this.artImgFlag = true;
      this.percentageFile = parseInt(file.percentage);
    },
    beforeAvatarUploadSM(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
    },
    handleAvatarSuccessImg(res, file) {
      this.percentageFile = 0;
      this.imgFlag = false;
      this.ImgUrl = res.data;
      let objImg = {
        imageUrl: this.ImgUrl,
        type: 1
      };
      this.addInfos.push(objImg);
    },
    uploadImgProcess(event, file, fileList) {
      this.imgFlag = true;
      this.percentageFile = parseInt(file.percentage);
    },
    beforeAvatarUploadImg(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
    },
    handleAvatarSuccessVid(res, file) {
      this.percentageFile = 0;
      this.videoFlag = false;
      this.VidUrl = res.data;
      let objVideo = {
        videoUrl: this.VidUrl,
        type: 2
      };
      this.addInfos.push(objVideo);
    },
    uploadVidProcess(event, file, fileList) {
      this.videoFlag = true;
      this.percentageFile = parseInt(file.percentage);
    },
    beforeAvatarUploadVid(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    }
  }
};
</script>
<style lang='less' scoped>
li {
  list-style-type: none;
}
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
.impImg {
  width: 800px;
  height: 400px;
}
.addChild {
  position: relative;
  width: 800px;
  height: 400px;
  margin-top: 20px;
  padding: 50px;
  border: 1px solid #ccc;
}
.addBTN {
  float: left;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.saveInfo {
  float: left;
  margin-top: 20px;
}
.txtClass {
  position: relative;
  width: 765px;
  height: 365px;
  border: 1px solid #e0e3e9;
  border-radius: 3px;
  resize: none;
  padding: 15px;
}
.addVideo {
  width: 100%;
  height: 400px;
}
.closeTxt {
  position: absolute;
  right: -4px;
  top: -4px;
  cursor: pointer;
}
.closeImg {
  position: absolute;
  top: -4px;
  z-index: 999;
  right: -4px;
  cursor: pointer;
}
.closeVideo {
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 999;
  cursor: pointer;
}
.upImg {
  margin-right: 30px;
}
.PosDes {
  color: #ccc;
  font-size: 14px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ccc;
}
.PosTit {
  padding-bottom: 5px;
}
.draggableCard {
  width: 180px;
  overflow: hidden;
  float: right;
  padding-bottom: 20px;
}
.draggableDiv {
  width: 140px;
  height: 140px;
  margin: 7px 0 0 0;
  margin-right: 7px;
  background: url("../../assets/images/txt.png") no-repeat;
  background-size: 100%;
  cursor: move;
}
.draggableDivFirst {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.iconList-move {
  transition: transform 0.5s;
}
</style>