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
        <el-table-column align="center" type="index" width="60"></el-table-column>
        <el-table-column align="center" prop="resourceUrl" label="封面">
          <template slot-scope="scope">
            <img id="img" :src="scope.row.resourceUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="resourceType" label="类型"></el-table-column>
        <el-table-column align="center" prop="diseaseTypeValue" label="疾病类型"></el-table-column>
        <el-table-column align="center" prop="resourceTypeDetail" label="资源路径"></el-table-column>
        <!-- <el-table-column align="center" prop="resourceOrder" label="排序号"></el-table-column> -->
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
        <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="类型" prop="resourceType">
            <el-select v-model="editForm.resourceType" filterable clearable placeholder="请选择">
              <el-option label="护理指导" :value="0"></el-option>
              <el-option label="健康知识" :value="1"></el-option>
              <el-option label="网页" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="疾病类型" prop="diseaseTypeValue">
            <el-select v-model="editForm.diseaseTypeId" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in disTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="this.editForm.resourceType == '2'"
            v-show="true"
            label="网页地址"
            prop="resourceTypeDetail"
          >
            <el-input v-model="editForm.resourceTypeDetail"></el-input>
          </el-form-item>
          <el-form-item
            v-if="this.editForm.resourceType == '0'"
            v-show="true"
            label="护理指导"
            prop="resourceTypeDetail"
          >
            <el-select v-model="editForm.resourceTypeDetail" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in nursingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="this.editForm.resourceType == '1'"
            v-show="true"
            label="健康知识"
            prop="resourceTypeDetail"
          >
            <el-select v-model="editForm.resourceTypeDetail" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in healthList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封面" prop="fmDescribe">
            <el-upload
              class="avatar-uploader"
              :action="this.UPLOAD_IMG"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-progress="uploadVideoProcess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="editForm.resourceUrl" :src="editForm.resourceUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-progress
              v-if="videoFlag == true"
              :percentage="percentageFile"
              style="margin-top:20px;"
            ></el-progress>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editEnter">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加页面 -->
      <el-dialog title="新增" :visible.sync="addDialogVisible" width="40%" @closed="addDialogClosed">
        <el-form :model="addForm" ref="addFormRef" label-width="80px">
          <el-form-item label="类型" prop="resourceType">
            <el-select v-model="addForm.resourceType" filterable clearable placeholder="请选择">
              <el-option label="护理指导" :value="0"></el-option>
              <el-option label="健康知识" :value="1"></el-option>
              <el-option label="网页" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="疾病类型" prop="diseaseTypeValue">
            <el-select v-model="addForm.diseaseTypeId" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in disTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="this.addForm.resourceType == '2'"
            v-show="true"
            label="网页地址"
            prop="resourceTypeDetail"
          >
            <el-input v-model="addForm.resourceTypeDetail"></el-input>
          </el-form-item>
          <el-form-item
            label="护理指导"
            prop="resourceTypeDetail"
            v-if="this.addForm.resourceType == '0'"
          >
            <el-select v-model="addForm.resourceTypeDetail" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in nursingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="健康知识"
            prop="resourceTypeDetail"
            v-if="this.addForm.resourceType == '1'"
          >
            <el-select v-model="addForm.resourceTypeDetail" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in healthList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封面" prop="resourceUrl">
            <el-upload
              class="avatar-uploader"
              :action="this.UPLOAD_IMG"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-progress="uploadVideoProcess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="addForm.resourceUrl" :src="addForm.resourceUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-progress
              v-if="videoFlag == true"
              :percentage="percentageFile"
              style="margin-top:20px;"
            ></el-progress>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary"  @click="addEnter" :disabled="isDisabled">确 定</el-button>
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
      addDialogVisible: false,
      editForm: {
        diseaseTypeId: null,
        resourceType: "",
        resourceTypeDetail: "",
        resourceUrl: ""
      },
      addForm: {
        diseaseTypeId: null,
        resourceType: "",
        resourceTypeDetail: "",
        resourceUrl: ""
      },
      nursingList: [],
      healthList: [],
      disTypeList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      VideoDiseaseList: [],
      imageUrl: "",
      editId: "",
      videoFlag: false,
      percentageFile: 0,
      isDisabled: false
    };
  },
  created() {
    this.getInfoList();
    this.getHealthList();
    this.getNursingList();
    this.getdisTypeList();
  },
  methods: {
    // 获取列表
    async getInfoList() {
      const { data: res } = await this.$http.post(
        "disease/banner/getDiseaseBannerList.do",
        { pageSize: 100000, pageNum: 1 }
      );
      console.log(res);
      this.VideoDiseaseList = res.rows;
    },
    // 获取疾病类型列表
    async getdisTypeList() {
      const { data: res } = await this.$http.post(
        "disease/type/getPDiseaseTypeList.do",
        {}
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      this.disTypeList = res.rows;
      console.log(this.disTypeList);
    },
    // 获取健康知识列表
    async getHealthList() {
      const { data: res } = await this.$http.post(
        "healthKnowledge/getPHealthKnowledgeList.do",
        { type: 1 }
      );
      this.healthList = res.rows;
    },
    // 获取护理指导列表
    async getNursingList() {
      const { data: res } = await this.$http.post(
        "healthKnowledge/getPHealthKnowledgeList.do",
        { type: 2 }
      );
      this.nursingList = res.rows;
    },
    // 刪除
    async removeUserById(id) {
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
        "disease/banner/delDiseaseBanner.do",
        {
          id: id
        }
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getInfoList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    showEditdialog(info) {
      this.editId = info.id;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
    // 确定修改
    editEnter() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("修改失败");
        const { data: res } = await this.$http.post(
          "disease/banner/updateDiseaseBanner.do",
          {
            id: this.editId,
            diseaseTypeId: this.editForm.diseaseTypeId,
            resourceType: this.editForm.resourceType,
            resourceTypeDetail: this.editForm.resourceTypeDetail,
            resourceUrl: this.editForm.resourceUrl
          }
        );
        if (res.code != 200) return this.$message.error("修改失败");
        this.$message.success("修改成功");
        this.getInfoList();
        this.editDialogVisible = false;
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 搜索
    ImgSearch() {},
    // 新增轮播图
    addEnter() {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false; 
        //点击一次时隔两秒后才能再次点击
      }, 2000);
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("添加失败");
        this.addDialogVisible = false;
        const { data: res } = await this.$http.post(
          "disease/banner/saveDiseaseBanner.do",
          {
            diseaseTypeId: this.addForm.diseaseTypeId,
            resourceType: this.addForm.resourceType,
            resourceTypeDetail: this.addForm.resourceTypeDetail,
            resourceUrl: this.addForm.resourceUrl
          }
        );
        if (res.code != 200) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.getInfoList();
      });
    },
    // 新增轮播图弹框
    addImg() {
      this.addDialogVisible = true;
      this.addForm = {};
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    handleAvatarSuccess(res, file) {
      if (res.code != 200) return this.$message.error("上传失败");
      this.percentageFile = 0;
      this.videoFlag = false;
      this.addForm.resourceUrl = res.data;
      this.editForm.resourceUrl = res.data;
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.percentageFile = parseInt(file.percentage);
    },
    beforeAvatarUpload(file) {
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

    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getWaterTypeList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getWaterTypeList();
    },
    // 高亮
    handleCurrentChange() {}
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