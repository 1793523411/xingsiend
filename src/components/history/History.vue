<template>
  <div class="card">
    <div class="headhistory">| 历史列表</div>
    <div style="height: 20px"></div>
    <el-form label-position="center" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="15">
          <el-card shadow="never">{{ desc }}</el-card>
        </el-col>
        <el-col :span="3">
          <div style="cursor: pointer">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline
"
              style="font-weight: bold; letter-spacing: 1px"
              @click="add()"
              >添加信息</el-button
            >
          </div>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="value"
            :placeholder="placeholder"
            @change="change"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="tableData"
      ref="singleTable"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <!-- <el-table-column prop="date" label="年份" width="180"></el-table-column> -->
      <!-- <el-table-column prop="name" label="描述" width="180"></el-table-column> -->
      <el-table-column prop="name" label="名字"></el-table-column>
      <el-table-column prop="job" label="任职情况"></el-table-column>
      <el-table-column prop="grade" label="专业班级"></el-table-column>
      <el-table-column prop="weight" label="权重"></el-table-column>
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
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业班级" :label-width="formLabelWidth">
          <el-input v-model="form.grade" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="任职" :label-width="formLabelWidth">
          <el-input v-model="form.job" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权重" :label-width="formLabelWidth">
          <div class="block">
            <el-slider
              v-model="weight"
              show-input
              :show-tooltip="false"
              :max="20"
            >
            </el-slider>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-pagination
      v-if="!value"
      @current-change="handleCurrentChange2"
      :current-page="currentPage4"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- <div class="add" @click="add()">
      <el-button type="primary" icon="el-icon-plus" plain>添加</el-button>
    </div> -->
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
      dialogVisible: false,
      options: [],
      value: "",
      response: [],
      tableData: [],
      desc: "",
      formLabelWidth: "120px",
      form: {
        name: "",
        year: "",
        grade: "",
        job: "",
      },
      isUpdate: false,
      updatePeronId: 0,
      weight: 0,
      placeholder: "",
      total: 10,
      currentPage4: 1,
    };
  },
  components: {
    // Add,
  },
  methods: {
    handleCurrentChange2(val) {
      this.currentPage4 = val;
      console.log(`当前页: ${val}`);
      this.getListPage(val, 5);
    },
    change() {
      this.$http.get("/history/select/all").then((res) => {
        console.log(res.data.data.histroy_year_data);
        res.data.data.histroy_year_data.forEach((item) => {
          if (item.historyYearId === this.value) {
            this.desc = item.description;
          }
        });
      });
      this.getList(this.value);
    },
    add() {
      if (!this.value) {
        this.$message("选择年份后才能添加");
        return;
      }
      //   alert("add,haha1");
      //   @click="dialogVisible = t rue"
      this.dialogVisible = true;
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleEdit(index, row) {
      this.isUpdate = true;
      console.log(index, row);
      this.dialogVisible = true;
      this.form = {
        name: row.name,
        grade: row.grade,
        job: row.job,
        year: 2020,
      };
      this.weight = row.weight;
      this.updatePeronId = row.historyPersonId;
      console.log(this.form);
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/history/person/delete/one/" + row.historyPersonId)
            .then(() => {
              this.$message("删除成功");
              if (this.value) {
                this.getList(row.yearId);
              } else {
                this.getListPage(this.currentPage4, 5);
              }
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
      // this.$message("没找到删除人的信息的接口");
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          this.form = {
            name: "",
            grade: "",
            year: "",
            job: "",
          };
          this.isUpdate = false;
          done();
        })
        .catch(() => {});
    },
    cancel() {
      this.dialogVisible = false;
      this.form = {
        name: "",
        grade: "",
        year: "",
        job: "",
      };
      this.isUpdate = false;
    },
    submit() {
      this.dialogVisible = false;
      console.log(this.form);
      //根据this.form.year找到year的年id
      let data = {
        id: this.value,
        data: [
          {
            name: this.form.name,
            grade: this.form.grade,
            job: this.form.job,
            weight: this.weight,
          },
        ],
      };
      if (!this.isUpdate) {
        if (
          this.form.name === "" ||
          this.form.grade === "" ||
          this.form.job === ""
        ) {
          this.$message("请将信息填完整");
          return;
        }
        this.$http.post("/history/person/add", data).then((res) => {
          console.log(res);
          if (this.value) {
            this.getList(this.value);
          } else {
            this.getListPage(this.currentPage4, 5);
          }

          this.form = {
            name: "",
            grade: "",
            year: "",
            job: "",
          };
        });
      } else {
        this.$message("调用修改成员接口");
        this.$http.get("/history/select/all").then((res) => {
          console.log(res);
          let other = {};
          res.data.data.histroy_year_data.forEach((item) => {
            if (item.historyYearId === this.value) {
              other = item;
            }
          });
          console.log(other);
          let data = {
            historyPersonId: this.updatePeronId,
            yearId: this.value,
            name: this.form.name,
            grade: this.form.grade,
            job: this.form.job,
            weight: this.weight,
          };
          console.log(data);
          this.$http.post("/history/update/person", data).then(() => {
            // this.getList(this.value);
            if (this.value) {
            this.getList(this.value);
          } else {
            this.getListPage(this.currentPage4, 5);
          }
          });
        });

        this.isUpdate = false;
      }
    },
    getList(id) {
      this.$http.get("/history/select/year/person/" + id).then((res) => {
        console.log(res);
        this.tableData = res.data.data.history_person_data;
      });
    },
    getListPage(page, limit) {
      this.$http
        .post("http://39.101.140.225:8080/history/select/all/page", {
          page: page,
          limit: limit,
        })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.history_person_data.total;
          this.tableData = [...res.data.data.history_person_data.records];
        });
    },
    getYear() {
      this.$http.get("/history/select/all").then((res) => {
        // console.log(res);
        let tmp = [];
        this.placeholder = "2020";
        res.data.data.histroy_year_data.forEach((item) => {
          let tmpobj = {
            value: item.historyYearId,
            label: item.year,
          };
          tmp.push(tmpobj);
        });
        this.options = tmp;
      });
    },
  },
  async created() {
    this.getYear();
    // this.getList(17);
    this.getListPage(1, 5);
  },
};
</script>

<style>
.el-card {
  border: none;
}

.card {
  padding-top: 25px;
  min-height: 500px;
}
.add {
  position: absolute;
  top: 125px;
  right: -900px;
  z-index: 10;
}
.headhistory {
  position: absolute;
  left: 230px;
  top: 100px;
  font-size: 20px;
  height: 25px;
  z-index: 88;
}
</style>
