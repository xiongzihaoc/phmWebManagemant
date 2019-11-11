<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
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
          <el-button type="primary">添加选项</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="menuList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="menuId"
        border
        stripe
        default-expand-all
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      >
        <el-table-column align="center" prop="menuName" label="名称" sortable width="180"></el-table-column>
        <el-table-column align="center" prop="menuType" label="菜单类型" sortable width="180"></el-table-column>
        <el-table-column align="center" prop="url" label="路径"></el-table-column>
        <el-table-column align="center" prop="icon" label="样式"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序号"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409167"
              inactive-color="#ccc"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              @click="showEditdialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 新增按钮 -->
            <el-button
              size="mini"
              @click="addDialog(scope.row)"
              type="success"
              icon="el-icon-circle-plus"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加提示框 -->
    <el-dialog title="添加选项" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="addForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-input v-model="addForm.menuType"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="样式">
          <el-input v-model="addForm.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑提示框 -->
    <el-dialog
      title="编辑选项"
      :visible.sync="editDialogVisible"
      width="40%"
      @closed="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="名称" prop="menuName">
          <el-input v-model="editForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-input v-model="editForm.menuType"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="样式" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      menuList: [],
      addDialogVisible: false,
      addForm: {
        menuName: "",
        menuType: "",
        icon: "",
        url: ""
      },
      addId: 0,
      editDialogVisible: false,
      editForm: {
        menuName: "",
        menuType: "",
        icon: "",
        url: ""
      },
      editId: 0,
      status:''
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.post("menu/getMenuList2.do");
      if (res.status != 200) return this.$message.error(res.msg);
      this.menuList = res.data;
      //   console.log(res);
    },
    // 修改弹框
    showEditdialog(val) {
      this.editForm = val;
      this.editId = val.menuId;
      this.editDialogVisible = true;
    },
    // 修改弹框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 确定修改
    async editEnter() {
      const { data: res } = await this.$http.post("menu/updateSysMenu.do", {
        menuId: this.editId,
        menuName: this.editForm.menuName,
        menuType: this.editForm.menuType,
        url: this.editForm.url,
        icon: this.editForm.icon
      });
      if (res.status != 200) return this.$message.error("操作失败");
      this.editDialogVisible = false;
      this.$message.success('操作成功')
      this.getMenuList();
    },
    // 改变状态按钮
    async userStateChanged(userinfo) {
      console.log(userinfo);
      if (userinfo.status = true) {
        userinfo.status = 0
      } else if (userinfo.status = false) {
        userinfo.status = 1
      }
       const { data: res } = await this.$http.post("menu/updateSysMenu.do", {
        menu_id: userinfo.menuId,
        status: userinfo.status
      });
      console.log(res);
      
      
    },
    // 增加菜单弹框
    addDialog(val) {
      this.addId = val.menuId;
      this.addDialogVisible = true;
    },
    // 确定增加
    async addEnter() {
      // console.log(this.addId);
      const { data: res } = await this.$http.post("menu/saveSysMenu.do", {
        parentId: this.addId,
        menuName: this.addForm.menuName,
        menuType: this.addForm.menuType,
        url: this.addForm.url,
        icon: this.addForm.icon
      });
      this.addDialogVisible = false;
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
.el-form {
  margin-right: 30px;
}
.el-table__row--level-0 .el-table_2_column_13 {
  display: none;
}
</style>