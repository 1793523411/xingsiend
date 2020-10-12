<template>
  <div class="card">
    <div class="headaddyear">| 年份管理</div>
    <!-- <div style="height:50px"></div> -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="year" label="年份" width="300"></el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="600"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="form">
        <el-form-item label="年份" :label-width="formLabelWidth">
          <el-input v-model="form.year" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-pagination
      @current-change="handleCurrentChange2"
      :current-page="currentPage4"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <div class="add">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline
"
        style="font-weight: bold; letter-spacing: 1px"
        @click="add()"
        >添加年份</el-button
      >
    </div>
    <!-- <div @click="add()">
      <add></add>
    </div> -->
  </div>
</template>

<script>
// import Add from "../common/Add";
export default {
  data() {
    return {
      tableData: [],
      form: {
        year: "",
        desc: "",
      },
      dialogVisible: false,
      formLabelWidth: "120px",
      isupdate: false,
      total: 0,
      currentPage4: 1,
      currentid:0
    };
  },
  components: {
    // Add,
  },
  methods: {
    handleCurrentChange2(val) {
      this.currentPage4 = val;
      console.log(`当前页: ${val}`);
      this.getList(val, 5);
    },
    handleEdit(index, row) {
      this.isupdate = true;
      // this.$message("没找修改历史接口");
      console.log(index, row);
      this.dialogVisible = true;
      this.form = {
        year: row.year,
        desc: row.description,
      };
      // let data = {
      //   year: this.form.year,
      //   description: this.form.desc,
      // };
      this.currentid = row.history_year_id
    },
    handleDelete(index, row) {
      console.log(row);
      this.$confirm("此操作将永久删除该, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.post("history/delete/" + row.history_year_id).then(() => {
            this.$message("del success");
            this.getList(this.currentPage4, 5);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      console.log(index, row);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    add() {
      //   alert("add,haha1");
      //   @click="dialogVisible = t rue"
      this.dialogVisible = true;
    },
    submit() {
      this.dialogVisible = false;
      console.log(this.form);
      //根据this.form.year找到year的年id
      let data = {
        year: this.form.year,
        description: this.form.desc,
      };

      if (!this.isupdate) {
        this.$http.post("/history/add", data).then((res) => {
          console.log(res);
          this.getList(this.currentPage4, 5);
          this.form = {
            year: "",
            desc: "",
          };
        });
      } else {
        // this.$http.post("history/delete/" + this.currentid).then(() => {
        //   // this.$message("del success");
        //   // this.getList();
        // });
        console.log(this.form);
        let data = {
          id:this.currentid,
          year: this.form.year,
          description: this.form.desc,
        };
        // this.$message("调用修改接口");
        this.$http.post("/history/update", data).then((res) => {
          console.log(res);
          this.getList(this.currentPage4, 5);
          this.currentid = 0
          this.form = {
            year: "",
            desc: "",
          };
        });
        this.isupdate = false;
      }
    },
    async getList(page, limit) {
      this.$http
        .post("/history/select/page", { page: page, limit: limit })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.history_year_data.total;
          this.tableData = [...res.data.data.history_year_data.records];
        });
    },
  },
  async created() {
    this.getList(1, 5);
    // alert('haha')
  },
};
</script>

<style scoped>
.card {
  padding-top: 28px;
  min-height: 500px;
}
.add {
  position: absolute;
  top: 98px;
  right: -900px;
  z-index: 10;
}
.headaddyear {
  position: absolute;
  left: 230px;
  top: 100px;
  font-size: 20px;
  height: 25px;
  z-index: 88;
}
</style>
