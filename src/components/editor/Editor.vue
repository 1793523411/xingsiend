<template>
  <div class="card">
    <el-page-header @back="goBack" content="编辑新闻"> </el-page-header>
    <el-input
          class="input"
          v-model="title"
          placeholder="请输入文章标题"
          style="left:0px;width:1050px;margin-bottom:0px"
        ></el-input>
    <div class="example">
      <el-upload
        class="upload-demo2"
        :show-file-list="false"
        drag
        :action="uploadURL"
        :headers="header"
        :on-success="handleSuccess"
        multiple
      >
        <el-button class="btn2" icon="el-icon-search" circle></el-button>
      </el-upload>
      <div :visible.sync="videoUploadTag">
        <el-dialog
          width="50%"
          id="video_upload"
          style="margin-top: 1px"
          title="视频上传"
          :visible.sync="videoUploadTag"
          append-to-body
        >
          <el-tabs v-model="activeName" value="0">
            <el-tab-pane label="添加视频链接" name="first">
              <el-input
                v-model="videoLink"
                placeholder="请输入视频链接"
                clearable
              ></el-input>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-search"
                style="margin: 20px 0px 10px 0px"
                @click="addVideoLink()"
                >添加</el-button
              >
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
      </div>
      <quill-editor
        class="editor"
        ref="myTextEditor"
        :value="content"
        :options="editorOption"
        @change="onEditorChange"
      />
    </div>
    <el-button type="primary" icon="el-icon-thumb" @click="complete"
      >完成</el-button
    >
    <el-button
      type="primary"
      icon="el-icon-refresh-left"
      @click="reset"
      style="margin-left: 16px"
      >清空</el-button
    >
    <el-button
      @click="drawer = true"
      type="primary"
      icon="el-icon-document-checked"
      style="margin-left: 16px"
      >完善文章信息</el-button
    >
    <el-button
      @click="drawer2 = true"
      type="primary"
      icon="el-icon-view"
      style="margin-left: 16px"
      >预览</el-button
    >

    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      :append-to-body="true"
    >
      <div class="draw">
        <!-- <div>文章标题</div>
        <el-input
          class="input"
          v-model="title"
          placeholder="请输入文章标题"
        ></el-input> -->
        <div>文章作者</div>
        <el-input
          class="input"
          v-model="author"
          placeholder="请输入文章作者"
        ></el-input>
        <div>文章简介</div>
        <el-input
          class="input"
          type="textarea"
          :rows="5"
          placeholder="请输入文章简介"
          v-model="text"
        ></el-input>
        <div class="wenzi">上传文章封面</div>
        <span v-if="tmp">
          <el-upload
            class="upload-demo"
            drag
            action="http://101.201.125.229:8082/image/upload/news/thumb"
            :headers="header"
            :on-success="handleAvatarSuccess"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              拖拽或
              <em>点击上传</em>
            </div>
          </el-upload>
        </span>
        <span v-else>
          <img class="img" :src="file.url" alt />
        </span>
        <el-button type="primary" icon="el-icon-search" @click="clearImg"
          >更改图片</el-button
        >
      </div>
    </el-drawer>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer2"
      :with-header="false"
      size="60%"
    >
      <div class="yulan">
        <div class="ql-editor" v-html="content"></div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import dedent from "dedent";
import hljs from "highlight.js";
import debounce from "lodash/debounce";
import "highlight.js/styles/atom-one-dark.css";

const toolbarOptions = [
  ["bold", "italic"],
  ["blockquote", "code-block"],
  [
    {
      header: 1,
    },
    {
      header: 2,
    },
  ],
  [
    {
      list: "ordered",
    },
    {
      list: "bullet",
    },
  ],
  [
    {
      script: "sub",
    },
    {
      script: "super",
    },
  ],
  [
    {
      indent: "-1",
    },
    {
      indent: "+1",
    },
  ],
  [
    {
      direction: "rtl",
    },
  ],
  [
    {
      size: ["small", false, "large", "huge"],
    },
  ],
  [
    {
      header: [1, 2, 3, 4, 5, 6, false],
    },
  ],
  [
    {
      color: [],
    },
    {
      background: [],
    },
  ],
  [
    {
      align: [],
    },
  ],
  ["clean"],
  ["link", "image", "video"],
];
export default {
  data() {
    var self2 = this;
    return {
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector(".upload-demo2 .btn2").click();
                } else {
                  this.quill.format("image", false);
                }
              },
              video: function () {
                this.quill.format("video", false);
                self2.videoUploadTag = true;
              },
            },
          },
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        },
      },
      content: dedent``,
      dialogVisible: false,
      imageUrl: "",
      tmp: true,
      uploadURL: "http://101.201.125.229:8082/image/upload/news",
      drawer: false,
      drawer2: false,
      title: "",
      author: "",
      text: "",
      file: {},
      uniqueId: "uniqueId",
      videoUploadTag: false,
      activeName: "first",
      videoLink: "",
      imgList: [],
    };
  },
  methods: {
    async add() {
      console.log(this.contentCode);
    },
    onEditorChange: debounce(function (value) {
      this.content = value.html;
    }, 466),
    clearImg() {
      this.file.url = "";
      this.tmp = true;
    },
    goBack() {
      this.$router.back(-1);
    },
    async complete() {
      if (this.content === "") {
        this.$message.warning("请输入内容");
        return;
      }
      // let time = this.$moment().format("YYYY-MM-DD HH:mm");
      let tmp = {
        title: this.title,
        author: this.author,
        head: this.text,
        thumb: this.file.url,
        name: this.file.name,
        content: this.content,
        img: this.imgList,
      };
      console.log(tmp);
      // this.uploadAll = tmp
      await this.$http.post("/news/add", tmp);

      this.$message.success("文章已被添加");
      this.content = "";
      this.title = "";
      this.text = "";
      this.author = "";
      this.file = {};
      this.tmp = true;
    },
    reset() {
      this.content = "";
      this.title = "";
      this.text = "";
      this.file = {};
      this.tmp = true;
      this.author = "";
      this.$message.success("已清空");
    },
    handleAvatarSuccess(res, file) {
      const { code, msg, data } = res;
      if (code !== 0) {
        console.log(res);
        this.$message({
          message: (msg && `上传失败，失败原因：${msg}`) || "上传失败",
          type: "error",
        });
        this.$emit("onError", data);
      } else {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        console.log(res);
        this.tmp = false;
        let tmplist = {
          name: res.data.img.name,
          url: res.data.img.url,
        };
        console.log(tmplist);
        this.file = tmplist;
        // console.log(this.contentCode);
      }

      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleSuccess(res) {
      console.log(res);
      const { data } = res;
      // 获取富文本组件实例
      let quill = this.$refs.myTextEditor.quill;
      // 如果上传成功
      if (data.img.url) {
        this.imgList.push(data.img.url);
        // 获取光标所在位置
        console.log(quill.getSelection());
        let length = quill.getSelection().index;
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, "image", data.img.url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        // 提示信息，需引入Message
        this.$message.error("图片插入失败");
      }
    },
    addVideoLink() {
      if (this.videoLink.length == 0) {
        this.$message.info("请输入视频链接");
        return;
      }
      //当编辑器中没有输入文本时，这里获取到的 range 为 null
      let quill = this.$refs.myTextEditor.quill;
      let range = quill.getSelection();

      // var range = this.$refs.myTextEditor.quill.getSelection();
      console.log(range);
      //视频插入在富文本中的位置
      var index = 0;
      if (range == null) {
        index = 0;
      } else {
        index = range.index;
      }
      //隐藏弹框
      this.videoUploadTag = false;
      //将视频链接插入到当前的富文本当中
      this.$refs.myTextEditor.quill.insertEmbed(index, "video", this.videoLink);
    },
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    contentCode() {
      return hljs.highlightAuto(this.content).value;
    },
    header() {
      return {
        Authorization: "Bearer " + window.sessionStorage.getItem("token"),
      };
    },
  },
  mounted() {
    console.log("this is Quill instance:", this.editor);
  },
};
</script>

<style scoped>
.card {
  padding-top: 25px;
  min-height: 500px;
  width: 1102px;
}

.el-button {
  position: relative;
  top: 10px;
}

.img {
  width: 100%;
}

.draw {
  padding: 20px;
}

.input {
  margin-top: 10px;
  margin-bottom: 20px;
}

.wenzi {
  margin-bottom: 10px;
}

.upload-demo2 {
  display: none;
}

.yulan {
  background-color: rgba(250, 57, 57, 0);
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow: auto;
}

.ql-editor {
  max-height: 550px;
}
</style>
