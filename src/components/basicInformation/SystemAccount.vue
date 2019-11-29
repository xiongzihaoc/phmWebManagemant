<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统帐户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="systemSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="systemSearch"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUsers">新增用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        stripe
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="userList"
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" prop="acId" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="userName" label="用户名"></el-table-column>
        <el-table-column align="center" prop="loginName" label="登录名"></el-table-column>
        <el-table-column align="center" prop="roleName" label="角色"></el-table-column>
        <el-table-column align="center" prop="deptName" label="部门"></el-table-column>
        <el-table-column align="center" prop="userEmail" label="邮箱"></el-table-column>
        <el-table-column align="center" prop="loginIp" label="IP"></el-table-column>
        <el-table-column align="center" prop="userPhone" label="手机号"></el-table-column>
        <el-table-column align="center" prop="operate" label="操作" width="180">
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
              @click="removeUserById(scope.row.acId)"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
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
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="40%">
      <el-form
        :rules="addFormRules"
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="editForm.loginName" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="editForm.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="editForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="editForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in RoleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-tree
            :data="hosMenuList"
            highlight-current
            icon-class="el-icon-caret-right"
            :props="defaultProps"
            @node-click="handleNodeClick"
            default-expand-all
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加页面 -->
    <el-dialog title="新增用戶" :visible.sync="addDialogVisible" width="40%">
      <el-form
        :rules="addFormRules"
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        @closed="addDialogClosed"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="addForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="addForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="addForm.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="addForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="addForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in RoleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-select v-model="addForm.deptId" placeholder="请选择">
            <el-option
              v-for="item in hosMenuList"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            ></el-option>
          </el-select>
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
    var checkEmaile = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoblie.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
    return {
      input: "",
      userList: [],
      //获取用户列表的参数对象
      pageSize: 9,
      pageNum: 1,
      total: 0,
      currentRow: null,
      editDialogVisible: false,
      editForm: {
        userName: "",
        userEmail: "",
        userPhone: "",
        roleId: null,
        deptId: null
      },
      addDialogVisible: false,
      addForm: {
        userName: "",
        userEmail: "",
        userPhone: "",
        loginName: "",
        userPassword: "",
        roleId: null,
        deptId: null
      },
      editId: 0,
      RoleList: [],
      hosMenuList: [],
      defaultProps: {
        children: "child",
        label: "deptName"
      },
      addFormRules: {
        userName: [
          { required: true, message: "请输入用户", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 16, message: "长度在 5 到 16 个字符", trigger: "blur" }
        ],
        userEmail: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: checkEmaile, trigger: "blur" }
        ],
        userPhone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
    this.getRoleList();
    this.getHosMenuList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post("user/getUserList.do", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        userName: this.input
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      this.userList = res.rows;
      this.total = res.total;
    },
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.post("role/getSysRoleList.do", {});
      console.log(res);
      if (res.code != 200) return this.$message.error("列表获取失败");
      this.RoleList = res.rows;
    },
    // 获取部门列表
    async getHosMenuList() {
      const { data: res } = await this.$http.post("dept/getDeptList.do", {});
      console.log(res);
      this.hosMenuList = res.data;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getUserList();
    },
    // 修改
    showEditdialog(info) {
      this.editId = info.acId;
      this.editForm = JSON.parse(JSON.stringify(info));
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("失败");
        const { data: res } = await this.$http.post("user/updateSysUser.do", {
          acId: this.editId,
          roleId: this.editForm.roleId,
          deptId: this.editForm.deptId,
          userName: this.editForm.userName,
          userEmail: this.editForm.userEmail,
          userPhone: this.editForm.userPhone,
          userPassword: this.$md5(this.editForm.userPassword)
        });
        if (res.code != 200) {
          return this.$message.error("修改用户信息失败");
        } else {
          this.$message.success("修改用户成功");
          this.editDialogVisible = false;
          this.getUserList();
        }
      });
    },
    // 删除
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
      const { data: res } = await this.$http.get(
        "user/delSysUser.do?acId=" + id
      );
      if (res.code == 200) {
        this.$message.success("删除成功");
        this.getUserList();
      } else {
        this.$message.error("删除失败");
        return;
      }
    },
    // 搜索
    systemSearch() {
      this.getUserList();
    },
    // 添加用户
    addUsers() {
      this.addDialogVisible = true;
      this.addForm = {};
    },
    async addEnter() {
      const { data: res } = this.$http.post("user/saveSysUser.do", {
        userName: this.addForm.userName,
        userEmail: this.addForm.userEmail,
        loginName: this.addForm.loginName,
        userPhone: this.addForm.userPhone,
        userPassword: this.$md5(this.addForm.userPassword),
        roleId: this.addForm.roleId,
        deptId: this.addForm.deptId
      });
      this.addDialogVisible = false;
      this.getUserList();
    },
    // 树形结构
    handleNodeClick(data) {
      console.log(data);
    },
    addDialogClosed() {},
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
</style>