<template>
  <div class="card">
    <div class="headimg">| 相册列表</div>
    <!-- <div style="height:50px"></div> -->
    <div style="height: 30px"></div>
    <div v-for="(items, index) in response" :key="index">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in items" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <div
              class="image"
              :style="{
                background: 'url(' + item.albumThumb + ') no-repeat center',
                fontSize: '1px',
                backgroundSize: 'cover',
              }"
              @click="details(item.albumId)"
            />
            <div style="padding: 14px">
              <div style="margin-left: -180px; font-size: 18px">
                {{ item.albumName }}
              </div>
              <br />
              <div style="font-size: 10px; margin-left: -120px; color: #ddd">
                {{ item.albumTime | dateFormat }}
              </div>
              <div class="bottom clearfix">
                <time class="time">{{ item.albumDesc }}</time>
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-delete"
                  class="button-my"
                  circle
                  @click="del(item.albumId)"
                ></el-button>
                <el-button
                  type="primary"
                  size="medium"
                  icon="el-icon-edit"
                  class="button-my"
                  circle
                  @click="update(item.albumId)"
                ></el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="添加相册"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      :showCancelButton="true"
    >
      <el-form :model="form">
        <el-form-item label="相册名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="相册描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        action="http://39.101.140.225:8080/image/upload/album/thumb"
        :on-error="onFail"
        :on-success="onSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        list-type="picture"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">上传该相册的封面</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <div class="addimg" @click="add()">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        style="font-weight: bold; letter-spacing: 1px"
        >添加相册</el-button
      >
    </div>
  </div>
</template>

<script>
// import Add from "../common/Add";
export default {
  data() {
    return {
      response: [],
      dialogFormVisible: false,
      form: {
        name: "",
        desc: "",
        src: "",
      },
      fileList: [],
      formLabelWidth: "120px",
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      isUpdate: false,
      currentId: 0,
    };
  },
  components: {
    // Add,
  },
  // filters: {
  //        formatDate(time) {
  //            let date = new Date(time);
  //            return dateFormat.formatDate(date, "yyyy.MM.dd");
  //        }
  // },
  methods: {
    chunk(array, size) {
      const length = array.length;
      if (!length || !size || size < 1) {
        return [];
      }
      let index = 0; //用来表示切割元素的范围start
      let resIndex = 0; //用来递增表示输出数组的下标
      let result = new Array(Math.ceil(length / size));
      while (index < length) {
        //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
        result[resIndex++] = array.slice(index, (index += size));
      }
      //输出新数组
      return result;
    },
    details(id) {
      console.log(id);
      this.$router.push({
        path: `/swiper/${id}`,
      });
    },
    add() {
      this.form = {
        name: "",
        desc: "",
        src: "",
      };
      if (this.fileList.length !== 0) {
        this.fileList = [];
      }
      this.dialogFormVisible = true;
      this.$alert(
        "上传图片请保留当前图片列表有且仅有一张图片，如果修改图片请先删除当前图片再重新上传，否则后果自负",
        "提醒",
        {
          confirmButtonText: "确定",
          callback: () => {
            this.$message({
              type: "info",
              message: `谢谢您的配合`,
            });
          },
        }
      );
    },
    submit() {
      if (!this.form.name | !this.form.desc | !this.form.src) {
        this.$message("请填写完整或重新上传图片");
        return;
      }
      this.dialogVisible = false;
      console.log(this.form);

      // this.form = {
      //   desc: "",
      //   name: "",
      // };
      if (!this.isUpdate) {
        let data = {
          name: this.form.name,
          description: this.form.desc,
          thumb: this.form.src,
        };
        this.$http.post("/album/add", data).then((res) => {
          console.log(res);
          this.dialogFormVisible = false;
          this.handleRemove();
          // this.form.name = "";
          // this.form.desc = "";
          this.getAllWal();
          this.form = {
            name: "",
            desc: "",
            src: "",
          };
        });
      } else {
        let data = {
          albumId: this.currentId,
          albumDescription: this.form.desc,
          albumThumb: this.form.src,
        };
        console.log("调用修改接口");
        this.$http.post("/album/update", data).then((res) => {
          console.log(res);
          this.dialogFormVisible = false;
          this.handleRemove();
          this.form.name = "";
          this.form.desc = "";
          this.getAllWal();
          this.form = {
            name: "",
            desc: "",
            src: "",
          };
        });
      }
    },
    del(id) {
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
          this.$http.post("/album/delete/" + id).then((res) => {
            console.log(res);
            this.getAllWal();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      console.log(id);
    },
    update(id) {
      if (this.fileList.length !== 0) {
        this.fileList = [];
      }
      this.$alert(
        "上传图片请保留当前图片列表有且仅有一张图片，如果修改图片请先删除当前图片再重新上传，否则后果自负",
        "提醒",
        {
          confirmButtonText: "确定",
          callback: () => {
            this.$message({
              type: "info",
              message: `谢谢您的配合`,
            });
          },
        }
      );
      this.isUpdate = true;
      this.currentId = id;
      // console.log(id)
      const all = this.response;
      let tmp = [];
      all.forEach((item) => {
        tmp.push(...item);
      });
      // console.log(tmp)
      let target = tmp.filter((item) => {
        return item.albumId === id;
      });
      // console.log(target[0])
      this.form = {
        name: "后端的接口没有这个字段",
        desc: target[0].albumDescription,
      };
      this.fileList.push({
        name: "111",
        url: target[0].albumThumb,
      });
      this.dialogFormVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          this.fileList = [];
          done();
        })
        .catch(() => {});
    },
    handleRemove(file, fileList) {
      this.form.src = "";
      this.fileList = [];
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onSuccess(file) {
      console.log(file);
      console.log(this.form);
      this.form.src = file.data.img.url;
      this.$message("上传成功");
    },
    onFail() {
      alert("fail");
    },
    getAllWal() {
      this.$http.get("/album/select/all").then((res) => {
        console.log(res);
        this.response = this.chunk(res.data.data.news_data, 4);
      });
    },
  },
  async created() {
    // await this.$http.get("/ablum").then((res) => {
    //   console.log(res.data);
    //   this.response = this.chunk(res.data.data, 4);
    //   console.log(this.response);
    // });
    this.getAllWal();
  },
};
</script>

<style scoped>
.card {
  margin-top: 5px;
  min-height: 500px;
  min-width: 1110px;
  background-color: rgba(255, 0, 0, 0);
}

.box-card2 {
  margin-bottom: 10px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button-my {
  padding: 0;
  float: right;
  width: 20px;
  height: 20px;
}

.image {
  width: 262.688px;
  height: 263.688px;
  overflow: hidden;
  display: block;
  cursor: pointer;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-card {
  margin-bottom: 20px;
}
.addimg {
  position: absolute;
  top: 90px;
  right: 27px;
  z-index: 10;
}
.headimg {
  position: absolute;
  left: 230px;
  top: 100px;
  font-size: 20px;
  height: 25px;
  z-index: 88;
}
</style>
