<template>
  <div>
    <!-- <el-page-header content="新闻列表"> </el-page-header> -->
    <div class="head">| 新闻列表</div>
    <div style="height: 50px"></div>
    <el-row type="flex">
      <el-col :span="18">
        <el-form label-width="80px" :model="formLabelAlign">
          <el-form-item label="名称">
            <!-- <el-input v-model="formLabelAlign.name"></el-input> -->
            <el-input
              placeholder="请输入内容"
              v-model="formLabelAlign.name"
              class="input-with-select"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="21"></el-col>
      <el-col :span="16">
        <el-button
          type="primary"
          @click="add"
          icon="el-icon-edit-outline"
          style="font-weight: bold; letter-spacing: 1px"
          >写新闻</el-button
        >
      </el-col>
    </el-row>

    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column
        prop="newsTitle"
        label="标题"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="authorName"
        label="姓名"
        width="100"
      ></el-table-column>
      <el-table-column prop="newsContentView" label="描述"></el-table-column>
      <el-table-column
        prop="visited"
        label="访问量"
        width="90"
      ></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑该新闻"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除该新闻"
            placement="top"
          >
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

    <el-pagination
      @current-change="handleCurrentChange2"
      :current-page="currentPage4"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-drawer title="" :visible.sync="drawer2" :with-header="true" size="70%">
      <div style="position:absolute;left:30px;top:70px">标题</div>
     
      <el-input
        class="input"
        v-model="title"
        placeholder="请输入文章标题"
        style="left: 0px; width: 900px; margin-bottom: 0px"
      ></el-input>
      <div class="example">
        <el-upload
          class="upload-demo2"
          :show-file-list="false"
          drag
          action="http://101.201.125.229:8082/image/upload/news"
          :headers="header"
          :on-success="handleSuccess"
          multiple
        >
          <el-button class="btn2" icon="el-icon-search" circle></el-button>
        </el-upload>
        <quill-editor
          class="editor"
          ref="myTextEditor"
          :value="content"
          :options="editorOption"
          @change="onEditorChange"
        />
      </div>
      <el-button type="primary" plain @click="complete">完成</el-button>
      <el-button type="primary" plain @click="reset" style="margin-left: 16px"
        >清空</el-button
      >
      <el-button
        @click="drawer = true"
        type="primary"
        plain
        style="margin-left: 16px"
        >完善文章信息</el-button
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
          <span v-if="!url">
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
              <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <!-- <el-button type="primary" plain @click="tmp = !tmp">变成图片</el-button> -->
          </span>
          <span v-else>
            <img class="img" :src="url" alt style="height:300px;;margin-bottom:10px"/>
            <br>
          </span>
          <el-button type="primary" plain @click="clearImg">更改图片</el-button>
        </div>
      </el-drawer>
    </el-drawer>

    <!--
    <div @click="add()">
      <add></add>
    </div>
      -->
  </div>
</template>

<script>
// import Add from "../common/Add";
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
    // var self2 = this;
    return {
      tableData: [],
      currentRow: null,
      total: 0,
      currentPage4: 1,
      drawer2: false,
      drawer: false,
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
            },
          },
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        },
      },
      content: dedent``,
      tmpNews: {},
      author: "",
      text: "",
      title: "",
      url: "",
      imgList: [],
      currentId: "",
      isupdate: false,
      formLabelAlign: {
        name: "",
      },
    };
  },
  components: {
    // Add,
  },
  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.currentId = row.newsId;
      this.drawer2 = true;
      let tmpNews = this.tableData.find((item) => {
        if (item.newsId === row.newsId) {
          return item;
        }
      });
      // console.log(this.tableData)
      console.log(tmpNews);
      this.content = tmpNews.newsContent;
      this.title = tmpNews.newsTitle;
      this.text = tmpNews.newsContentView;
      this.url = tmpNews.newsPictureViewUrl;
      this.author = tmpNews.authorName;
    },
    onEditorChange: debounce(function (value) {
      this.content = value.html;
    }, 466),
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
        // this.tmp = false;
        this.url = res.data.img.url;
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
        thumb: this.url,
        content: this.content,
        id: this.currentId,
        // img: this.imgList,
      };
      console.log(tmp);
      // this.uploadAll = tmp
      await this.$http.post("/news/update", tmp).then((res) => {
        console.log(res);
        // this.$http.post("/news/delete/" + this.currentId).then((res) => {
        //   console.log(res);
        this.getList(this.currentPage4, 5);
        // });
      });

      this.$message.success("文章已被修改");
      this.content = "";
      this.title = "";
      this.text = "";
      this.author = "";
      this.file = {};
      this.tmp = true;
    },
    clearImg() {
      this.url = "";
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
          this.$http.post("/news/delete/" + row.newsId).then((res) => {
            console.log(res);
            this.getList(this.currentPage4, 5);
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
    handleCurrentChange2(val) {
      this.currentPage4 = val;
      console.log(`当前页: ${val}`);
      this.getList(val, 5);
    },
    add() {
      this.$router.push("/editor");
      window.sessionStorage.setItem("activePath", "/editor");
    },
    search() {
      console.log(this.formLabelAlign.name);
      let datas = {
        message: this.formLabelAlign.name,
      };
      console.log(datas);
      this.$http.post("/news/search", datas).then((res) => {
        console.log(res);
        this.tableData = res.data.data.news_data;
        this.total = res.data.data.total;
      });
      // this.$http({
      //   method: "post",
      //   url: "/news/search",
      //   data: datas,
      //   // headers: { "Content-type": "multipart/form-data" },
      // }).then((res) => {
      //   console.log(res);
      //   // this.tableData = res.data;
      // });
    },
    getList(page, limit) {
      this.$http
        .post("/news/select/page", { page: page, limit: limit })
        .then((res) => {
          console.log(res.data.data.news_data);
          this.total = res.data.data.news_data.total;
          this.tableData = [...res.data.data.news_data.records];
          this.tableData.forEach((item) => {
            const dt = new Date(item.createTime);

            const y = dt.getFullYear();
            const m = (dt.getMonth() + 1 + "").padStart(2, "0");
            const d = (dt.getDate() + "").padStart(2, "0");

            const hh = (dt.getHours() + "").padStart(2, "0");
            const mm = (dt.getMinutes() + "").padStart(2, "0");
            const ss = (dt.getSeconds() + "").padStart(2, "0");
            item.createTime = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
          });
        });
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
  async created() {
    // await this.$http.get("/news").then((res) => {
    //     console.log(res);
    //     this.tableData = [...res.data.data.list];
    // });
    this.getList(1, 5);
  },
};
</script>

<style scope>
.upload-demo2 {
  display: none;
}
.example {
  padding: 20px;
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
.img {
  width: 100%;
}
/* .el-button: {
  margin-left: -10px;
} */
.head {
  position: absolute;
  left: 230px;
  font-size: 20px;
  height: 25px;
  z-index: 88;
}
</style>
