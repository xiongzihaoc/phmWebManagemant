<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>食物管理</el-breadcrumb-item>
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
          <el-button type="primary">添加食物</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="foodList" stripe border style="width: 100%">
        <el-table-column align="center" type="selection" width="40"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="fdName" label="名称"></el-table-column>
        <el-table-column align="center" label="图标">
          <template slot-scope="scope">
            <img :src="scope.row.fdPhotoPath" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fdTypeValue" label="类型"></el-table-column>
        <el-table-column align="center" prop="elementName" label="元素名称"></el-table-column>
        <!-- <el-table-column prop="address" label="描述"></el-table-column> -->
        <el-table-column align="center" prop="operate" label="操作" width="160">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button @click="showEditdialog(scope.row)" type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改页面 -->
    <el-dialog title="修改" :visible.sync="editDialogVisible" width="40%">
      <el-form label-width="80px">
        <el-form-item label="食物名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="食物类型">
          <el-select v-model="value2" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否常见">
          <el-select v-model="value" placeholder="请选择">
            <el-option label="0" value="0"></el-option>
            <el-option label="1" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="食物描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 10}"
            placeholder="请输入内容"
            v-model="textarea2"
          ></el-input>
        </el-form-item>
        <el-form-item label="食物图片">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
      editDialogVisible: false,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      value2: "",
      imageUrl: "",
      textarea2:''
    };
  },

  created() {
    this.getFoodList();
  },

  methods: {
    // 获取用户列表
    async getFoodList() {
      const { data: res } = await this.$http.post("food/getPFoodList.do", {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      console.log(res);
      if (res.code != 200) return this.$message.error("数获取失败");
      this.foodList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getFoodList();
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
      this.getFoodList();
    },
    // 修改
    showEditdialog(info) {
      console.log(info);
      this.editDialogVisible = true;
    },
    edit() {
      this.editDialogVisible = false;
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.diseaseDes {
  display: block;
  height: 100px;
}
</style>