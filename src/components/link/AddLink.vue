<template>
  <div class="card">
            <div class="headsort">| 分类管理</div>
    <!-- <div style="height:50px"></div> -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="typeDescription"
        label="分类"
        width="800"
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
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

<div class="add" @click="add()">
      <el-button type="primary" icon="el-icon-circle-plus-outline
" style="font-weight:bold;letter-spacing:1px;">添加分类</el-button>
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
        desc: "",
      },
      dialogVisible: false,
      formLabelWidth: "120px",
      isUpdate: false,
      currentId: 0,
    };
  },
  components: {
    // Add,
  },
  methods: {
    handleEdit(index, row) {
      this.isUpdate = true;
      this.dialogVisible = true;
      console.log(index, row);
      this.form = {
        desc: row.typeDescription,
      };
      this.currentId = row.websiteTypeId;
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
          this.$http.post("/website/delete/" + row.websiteTypeId).then(() => {
            this.getSort();
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
      this.dialogVisible = true;
    },
    submit() {
      this.dialogVisible = false;
      console.log(this.form);
      let data = {
        description: this.form.desc,
      };

      if (!this.isUpdate) {
        this.$http.post("/website/add", data).then((res) => {
          console.log(res);
          this.form = {
            desc: "",
          };
          this.getSort();
        });
      } else {
        let data = {
          id: this.currentId,
          description: this.form.desc,
        };
        this.$http.post("/website/update/type", data).then((res) => {
          console.log(res);
          this.getSort();
          this.form = {
            desc: "",
          };
          this.isUpdate = false;
        });
      }
    },
    getSort() {
      this.$http.get("/website/select/type/all").then((res) => {
        console.log(res);
        this.tableData = res.data.data.website_type_data;
      });
    },
  },
  created() {
    // this.$http.get('/history/select/all')
    // alert('haha')
    this.getSort();
  },
};
</script>

<style scoped>
.card {
  padding-top: 28px;
  min-height: 500px;
}
.add{
    position: absolute;
    top: 98px;
    right: -900px;
   z-index: 10;
}
.headsort{
  position: absolute;
  left: 230px;
  top: 100px;
  font-size: 20px;
  height: 25px;
  z-index: 88;
}
</style>
