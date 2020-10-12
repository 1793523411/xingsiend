<template>
  <div class="card">
               <div class="headlink">| 链接管理</div>
    <div style="height:20px"></div>
    <el-form label-position="center" label-width="80px">
      <el-row :gutter="20">
                <el-col :span="15">
          <el-card shadow="never">{{ desc }}</el-card>
        </el-col>
        <el-col :span="3">
          <!-- <div class="add" @click="add()"> -->
          <el-button type="primary" icon="el-icon-circle-plus-outline
" @click="add()" style="font-weight:bold;letter-spacing:1px"
            >添加链接</el-button
          >
          <!-- </div> -->
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="value"
            :placeholder="ploaceholder"
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
      <el-table-column prop="websiteName" label="名称"></el-table-column>
      <el-table-column prop="url" label="链接"></el-table-column>
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
        <el-form-item label="URL" :label-width="formLabelWidth">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

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
        url: "",
      },
      isUpdate: false,
      currUrlId: "",
      ploaceholder: "",
    };
  },
  components: {
    // Add,
  },
  methods: {
    change() {
      this.getLink(this.value);
    },
    add() {
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
      this.dialogVisible = true;
      this.isUpdate = true;
      this.currUrlId = row.websiteUrlId;
      console.log(index, row);
      this.form = {
        name: row.websiteName,
        url: row.url,
      };
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.$http
            .post("/website/detail/delete/" + row.websiteUrlId)
            .then(() => {
              this.getLink(this.value);
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
    submit() {
      this.dialogVisible = false;
      console.log(this.form);
      //根据this.form.name找到对应类别的类别id
      let data = {
        id: this.value,
        name: this.form.name,
        url: this.form.url,
      };

      if (!this.isUpdate) {
        this.$http.post("/website/detail/add", data).then((res) => {
          console.log(res);
          this.form = {
            name: "",
            url: "",
          };
          this.getLink(this.value);
        });
      } else {
        let data = {
          id: this.value,
          name: this.form.name,
          url: this.form.url,
        };

        this.$http.post("/website/detail/delete/" + this.currUrlId).then(() => {
          this.$http.post("/website/detail/add", data).then((res) => {
            console.log(res);
            this.getLink(this.value);
            this.form = {
              name: "",
              url: "",
            };
          });
          this.isUpdate = false;
        });
      }
    },
    getSortId() {
      this.$http.get("/website/select/type/all").then((res) => {
        console.log(res.data.data.website_type_data);
        let tmp = [];
        res.data.data.website_type_data.forEach((item) => {
          let tmpobj = {
            value: item.websiteTypeId,
            label: item.typeDescription,
          };
          tmp.push(tmpobj);
        });
        // console.log(this.options)
        this.options = tmp;
        console.log(res.data.data.website_type_data[0].typeDescription);
        this.ploaceholder = res.data.data.website_type_data[0].typeDescription;
        console.log(res.data.data.website_type_data[0].websiteTypeId);
        this.getLink(res.data.data.website_type_data[0].websiteTypeId);
      });
    },
    getLink(id) {
      this.$http.get("/website/select/url/" + id).then((res) => {
        console.log(res);
        this.tableData = res.data.data.person_msg;
      });
    },
  },
  async created() {
    this.getSortId();
    // this.getLink(this.options[0].websiteTypeId);
    //   alert('data')
    // await this.$http.get("/history").then((res) => {
    //     //   console.log(res.data);
    //     this.response = res.data.data;
    //     let year = new Set();
    //     res.data.data.forEach((item) => {
    //         year.add(item.year);
    //     });
    //     for (let item of year) {
    //         let tmp = {
    //             value: item,
    //             label: item,
    //         };
    //         this.options.push(tmp);
    //     }
    //     let tmp = this.response;
    //     let tmpres = tmp.filter((item) => {
    //         return item.year === 2020;
    //     });
    //     //   console.log(tmpres);
    //     this.desc = tmpres[0].description;
    //     let tmpres2 = [];
    //     tmpres.forEach((item) => {
    //         tmpres2.push(...item.personList);
    //     });
    //     //   console.log(tmpres2);
    //     this.tableData = tmpres2;
    //     //   console.log(this.options);
    // });
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
  left: 220px;
  z-index: 10;
}
.headlink{
  position: absolute;
  left: 230px;
  top: 100px;
  font-size: 20px;
  height: 25px;
  z-index: 88;
}
</style>
