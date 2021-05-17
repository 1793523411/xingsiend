/* eslint-disable no-unused-vars */
<template>
  <div>
    <el-upload
      class="upload-demo"
      action="http://xsbanner.xsgzs.cn/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList"
      list-type="picture"
      name="pic"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <img :src="curimg" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      curimg: "",
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.$http
        .get("http://xsbanner.xsgzs.cn/delete?name=" + file.name)
        .then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
        });
    },
    handlePreview(file) {
      console.log(file);
      this.dialogVisible = true;
      this.curimg = file.url;
    },
    handleSuccess() {
      this.$message({
        message: "上传成功",
        type: "success",
      });
    },
    handleError() {
      this.$message({
        message: "上传失败",
        type: "error",
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
  },
  mounted() {
    this.$http.get("http://xsbanner.xsgzs.cn/").then((res) => {
      console.log(res.data);
      this.fileList = res.data;
    });
  },
};
</script>

<style>
</style>