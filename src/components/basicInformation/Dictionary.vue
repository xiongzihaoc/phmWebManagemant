<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据字典</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.enter.native="dicSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="dicSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="menuList"
        :lazy="true"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        :header-cell-style="{background:'#f5f5f5'}"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="###  名称" sortable></el-table-column>
        <el-table-column align="center" prop="dictValue" label="键值" sortable></el-table-column>
        <el-table-column align="center" prop="isEnable" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isEnable"
              active-color="#409167"
              inactive-color="#ccc"
              active-value="0"
              inactive-value="1"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="dictSort" label="排序号"></el-table-column>
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
              @click="addDictionarybtn(scope.row)"
              type="success"
              icon="el-icon-circle-plus"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加修改提示框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="DialogVisible"
      width="40%"
      @closed="AddEditDialogClosed"
    >
      <el-form ref="addFormRef" :model="addEditForm" label-width="80px">
        <el-form-item :label="labelTitle">
          <el-input v-model="goBack" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="addEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="键值">
          <el-input v-model="addEditForm.dictValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEditEnter">确 定</el-button>
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
      addEditForm: {
        name: "",
        dictValue: ""
      },
      parentId: null,
      parentCode: "",
      selfId: null,
      DialogVisible: false,
      dialogTitle: "",
      goBack: "",
      labelTitle: "",
      currentRow: null
    };
  },
  created() {
    this.getDictionaryList();
  },
  methods: {
    async getDictionaryList() {
      const { data: res } = await this.$http.post(
        "sys/dict/getSysDictList.do",
        {}
      );
      this.menuList = res.data;
    },
    // 增加
    addDictionarybtn(info) {
      this.dialogTitle = "添加";
      this.labelTitle = "上一级";
      this.goBack = info.name;
      this.parentId = info.id;
      this.parentCode = info.parentCode;
      this.DialogVisible = true;
    },
    // 确定修改或添加
    async addEditEnter() {
      let httpUrl = "";
      let parm = {};
      if (this.dialogTitle == "修改") {
        httpUrl = "sys/dict/updateSysDict.do";
        parm = {
          id: this.selfId,
          name: this.addEditForm.name,
          dictValue: this.addEditForm.dictValue
        };
      } else {
        httpUrl = "sys/dict/saveSysDict.do";
        parm = {
          parentCode: this.parentCode,
          parentId: this.parentId,
          name: this.addEditForm.name,
          dictValue: this.addEditForm.dictValue
        };
      }
      const { data: res } = await this.$http.post(httpUrl, parm);
      if (res.code != 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      this.getDictionaryList();
      this.DialogVisible = false;
    },
    // 修改
    showEditdialog(info) {
      this.selfId = info.id;
      this.goBack = info.name;
      this.labelTitle = "本级";
      this.dialogTitle = "修改";
      this.addEditForm = JSON.parse(JSON.stringify(info));
      this.DialogVisible = true;
    },
    // 重置
    AddEditDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 改变状态按钮
    async userStateChanged(userinfo) {
      // const { data: res } = await this.$http.post("menu/updateSysMenu.do", {
      //   menuId: userinfo.menuId,
      //   code: userinfo.code
      // });
      // if (res.code != 200) {
      //   userinfo.code = !userinfo.code;
      //   return this.$message.error("更新用户状态失败");
      // } else {
      //   this.$message.success("更新用户状态成功");
      // }
    },
    // 搜索
    dicSearch() {},
    // 操作里面新增
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