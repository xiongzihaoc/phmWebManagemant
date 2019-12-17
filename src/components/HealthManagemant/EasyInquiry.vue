<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="input" @keyup.13.native="disTypeSearch" clearable>
            <el-button slot="append" icon="el-icon-search" @click="disTypeSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="healthPackageList"
        ref="singleTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="inviteCode" label="邀请码"></el-table-column>
        <el-table-column align="center" prop="memberName" label="用户名称"></el-table-column>
        <el-table-column align="center" prop="doctorName" label="医生名称"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <div>{{healthPackageStatus(scope.row)}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="begin" label="开始时间">
          <template slot-scope="scope">
            <div>{{timesChangeDate(scope.row.beginTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="end" label="结束时间">
          <template slot-scope="scope">
            <div>{{timesChangeDate(scope.row.endTime)}}</div>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      currentRow: null,
      healthPackageList: []
    };
  },

  created() {
    this.getHealthPackageList();
  },

  methods: {
    // 获取疾病种类列表
    async getHealthPackageList() {
      const { data: res } = await this.$http.post(
        "member/disease/getPMemberDiseaseList.do",
        {
          memberName: this.input,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      this.healthPackageList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getHealthPackageList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getHealthPackageList();
    },
    // 搜索
    disTypeSearch() {
      this.getHealthPackageList();
    },
    // 实现表格单行选择高亮
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    timesChangeDate(times) {
      var da = new Date(times);
      var year = da.getFullYear();
      var month = da.getMonth() + 1;
      var date = da.getDate();
      return [year, month, date].join("/");
    },
    healthPackageStatus(item) {
      var now = Date.now();
      if (item.beginTime == "null") {
        if (item.endTime < now) {
          return "已失效";
        } else {
          return "未开始";
        }
      } else {
        if (item.endTime < now) {
          return "已失效";
        } else {
          return "已开始";
        }
      }
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

.diseaseDes {
  display: block;
  height: 100px;
}
</style>