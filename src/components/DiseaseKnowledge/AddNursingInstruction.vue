<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/diseaseknowledge/nursingInstruction' }">护理指导</el-breadcrumb-item>
      <el-breadcrumb-item>护理指导新增</el-breadcrumb-item>
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
            :before-upload="beforeAvatarUploadSM"
          >
            <img v-if="editform.articleImagesUrl" :src="editform.articleImagesUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
      <!-- 拖拽区域 -->
      <el-card class="draggableCard" v-show="addInfoss.length>0">
        <div id="changePositionBox">
          <span class="PosTit" style="font-weight:700">调整顺序</span>
          <div class="draggableCon">
            <vuedraggable v-model="addInfoss">
              <transition-group tag="p">
                <div v-for="(item,index) in addInfoss" v-bind:key="index">
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
      <ul class="addImgVid" v-for="item in addInfoss" :key="item.id">
        <li class="addChild" v-if="item.type==0">
          <textarea class="txtClass" placeholder="请输入内容" v-model="item.textDescription"></textarea>
          <span @click="infoDelete(item.id)" class="el-icon-error closeTxt"></span>
        </li>
        <li class="addChild" v-if="item.type==1">
          <img class="impImg" :src="item.imageUrl" alt />
          <span @click="infoDelete(item.id)" class="el-icon-error closeImg"></span>
        </li>
        <li class="addChild" v-if="item.type==2">
          <video class="addVideo" :src="item.videoUrl" controls :poster="item.imageUrl"></video>
          <span @click="infoDelete(item.id)" class="el-icon-error closeVideo"></span>
        </li>
      </ul>
      <div style="overflow:hidden;">
        <el-button class="addBTN offSetWord" type="primary" round @click="addWord">添加文字</el-button>
        <el-upload
          class="upload-demo"
          :action="this.UPLOAD_IMG"
          :on-success="handleAvatarSuccessImg"
          :before-upload="beforeAvatarUploadImg"
          :show-file-list="false"
        >
          <el-button class="addBTN upImg" round type="primary">添加图片</el-button>
        </el-upload>
        <el-upload
          class="upload-demo"
          :action="this.UPLOAD_IMG"
          :on-success="handleAvatarSuccessVid"
          :before-upload="beforeAvatarUploadVid"
          :show-file-list="false"
        >
          <el-button class="addBTN upImg" round type="primary">添加视频</el-button>
        </el-upload>
        <el-button @click="saveInfo" type="success" class="saveInfo" round>保存修改</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";
export default {
  name: "AddNursingInstruction",
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
      addInfoss: [],
      ImgUrl: "",
      VidUrl: ""
    };
  },
  created() {
    this.getHealthList();
  },
  methods: {
    // 获取疾病类型
    async getHealthList() {
      const { data: res } = await this.$http.post(
        "disease/type/getPDiseaseTypeList.do",
        {}
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);

      this.foodList = res.rows;
      this.total = res.total;
      this.healthList = res.rows;
    },
    saveInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        const { data: res } = await this.$http.post(
          "healthKnowledge/savePHealthKnowledge.do",
          {
            name: this.editform.name,
            diseaseTypeId: this.editform.diseaseTypeId,
            description: this.editform.description,
            type: 2,
            resourcesList: this.addInfoss,
            articleImagesUrl: this.editform.articleImagesUrl
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
    // 修改
    addWord() {
      let objWord = {
        textDescription: "",
        type: 0
      };
      this.addInfoss.push(objWord);
    },
    // 單個刪除
    infoDelete(info) {
      var arr = this.addInfoss;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == info) {
          arr[i].ImgUrl = "";
          arr[i].VidUrl = "";
          arr.splice(i, 1);
        }
      }
    },
    handleAvatarSuccessSM(res, file) {
      this.editform.articleImagesUrl = res.data;
    },
    beforeAvatarUploadSM(file) {
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
    },
    handleAvatarSuccessImg(res, file) {
      this.ImgUrl = res.data;
      let objImg = {
        imageUrl: this.ImgUrl,
        type: 1
      };
      this.addInfoss.push(objImg);
    },
    beforeAvatarUploadImg(file) {
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
    },
    handleAvatarSuccessVid(res, file) {
      console.log(res);

      this.VidUrl = res.data;
      let objVideo = {
        videoUrl: this.VidUrl,
        type: 2
      };
      this.addInfoss.push(objVideo);
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
  margin-right: 300px;
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