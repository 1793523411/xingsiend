<template>
  <div class="card">
    <el-row :gutter="20">
      <el-col :span="15">
        <el-page-header
          @back="goBack"
          :content="response.albumName"
          style="margin-bottom: 25px"
        ></el-page-header>
      </el-col>
      <el-col :span="9">
        <div>{{ response.albumDesc }}</div>
      </el-col>
    </el-row>

    <div v-for="(items, index) in img" :key="index">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in items" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <img
              class="image"
               :style="{background:'url('+item.pictureUrl +') no-repeat center',fontSize:'1px',backgroundSize: 'cover'}"
              @click="look(item.pictureUrl)"
            />
            <div style="padding: 14px">
              <div style="font-size: 10px;margin-left: -120px">{{ item.createTime | dateFormat}}</div>
              <div class="bottom clearfix">
                <time class="time" >{{ item.pictureDescription }}</time>
                <el-button type="danger" size="medium" icon="el-icon-delete" circle class="button-my2" @click="del(item.wallPictureId)"></el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="添加照片" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="照片名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="照片描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        action="http://39.101.140.225:8080/image/upload/album"
        :on-preview="handlePreview"
        :on-success="onSuccess"
        :on-remove="handleRemove"
        :file-list="fileList"
        list-type="picture"
        :limit="1"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">上传照片</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <div @click="add()">
      <add></add>
    </div> -->
    <div class="addimg2" @click="add()" >
      <el-button type="primary" icon="el-icon-plus" size="small" style="font-weight:bold;letter-spacing:1px">添加图片</el-button>
  </div>
  </div>
</template>

<script>
// import Add from "../common/Add";
export default {
  data() {
    return {
      response: {},
      img: [],
      dialogFormVisible: false,
      form: {
        name: "",
        desc: "",
      },
      formLabelWidth: "120px",
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
      currImgSrc: "",
    };
  },
  components: {
    // Add,
  },
  methods: {
    chunk(array, size) {
      const length = array.length;
      if (!length || !size || size < 1) {
        return [];
      }
      let index = 0;
      let resIndex = 0;
      let result = new Array(Math.ceil(length / size));
      while (index < length) {
        result[resIndex++] = array.slice(index, (index += size));
      }
      return result;
    },
    goBack() {
      this.$router.back(-1);
    },
    onSuccess(file) {
      console.log(file);
      this.form.src = file.data.img.url;
      this.$message("上传成功");
      this.currImgSrc = file.data.img.url;
    },
    look(url) {
      window.open(url, "_blank");
    },
    add() {
      this.dialogFormVisible = true;
      //       this.$alert(
      //   "上传图片请保留当前图片列表有且仅有一张图片，如果修改图片请先删除当前图片再重新上传，否则后果自负",
      //   "提醒",
      //   {
      //     confirmButtonText: "确定",
      //     callback: () => {
      //       this.$message({
      //         type: "info",
      //         message: `谢谢您的配合`,
      //       });
      //     },
      //   }
      // );
    },
    del(id){

      // this.$http.post('/image/delete/album/img/?picture='+url.split('/')[url.split('/').length-1]).then(res =>{
      this.$http.post('/album/picture/delete/'+id).then(res =>{
        console.log(res)
        this.getPicture();
      })
    },
    submit() {
      if(!this.currImgSrc||!this.form.desc) {
        this.$message('请将信息填写完整')
        return
      }
      this.dialogFormVisible = false;
      console.log(this.form);
      let data = {
        pictureUrl: this.currImgSrc,
        pictureDescription: this.form.desc,
        albumId: this.$route.params.id,
      };
      console.log(data);
      this.$http.post("/album/picture/add", data).then((res) => {
        console.log(res);
        this.getPicture()
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    async getPicture() {
      await this.$http
        .get("/album/picture/url/" + this.$route.params.id)
        .then((res) => {
          console.log(res.data);
          // this.response = res.data.data;
          // console.log(this.response)
          // console.log(res.data.data.photoList)
          this.img = this.chunk(res.data.data.wall_picture_url, 4);
          console.log(this.img);
          // console.log(this.img);
        });
    },
  },
  async created() {
    console.log(this.$route.params.id);
    this.getPicture();
  },
};
</script>

<style scope>
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

.button-my2 {
  padding: 0 !important;
  float: right;
  width: 20px;
  height: 20px;
}
/*
.image {
  width: 100%;
  display: block;
}
*/

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
.addimg2{
    position: absolute;
    top: 88px;
    right: 27px;
   z-index: 10;
}
</style>