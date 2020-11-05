<template>
  <div :theme="theme">
    <el-container>
      <el-header>
        <div class="header">
        <img
          src="../assets/img/xingsilogo.png"
        />
        <span>后台管理系统</span>
        <el-dropdown size="mini" @command="handleCommand">
          <img style="cursor: pointer;"
            src="../assets/img/avtor.jpg"
          />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">
              <i class="el-icon-eleme" aria-hidden="true"></i>退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      </el-header>
      <el-container>
        <el-aside width="180px">
          <el-row class="tac">
            <el-col :span="24">
              <el-menu
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                unique-opened
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :default-active="activePath"
                router
              >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-s-management"></i>
                    <span>新闻管理</span>
                  </template>
                  <el-menu-item-group>
                    <!--<el-menu-item index="/editor" @click="saveNavState('/' + 'editor')">编辑新闻</el-menu-item>-->
                    <el-menu-item
                      index="/article"
                      @click="saveNavState('/' + 'article')"
                      >新闻列表</el-menu-item
                    >
                    <!-- <el-menu-item index="1-3">选项3</el-menu-item> -->
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-picture"></i>
                    <span>图片管理</span>
                  </template>
                  <el-menu-item-group>
                    <!-- <el-menu-item index="/swiper" @click="saveNavState('/' + 'swiper')">添加相册</el-menu-item>
                    <el-menu-item index="/addimg" @click="saveNavState('/' + 'addimg')">添加图片</el-menu-item> -->
                    <el-menu-item
                      index="/wall"
                      @click="saveNavState('/' + 'wall')"
                      >相册列表</el-menu-item
                    >
                    <!-- <el-menu-item index="2-3">选项3</el-menu-item> -->
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-s-claim"></i>
                    <span>历史管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item
                      index="/AddHistory"
                      @click="saveNavState('/' + 'AddHistory')"
                      >年份管理</el-menu-item
                    >
                    <el-menu-item
                      index="/History"
                      @click="saveNavState('/' + 'History')"
                      >历史列表</el-menu-item
                    >
                    <!-- <el-menu-item index="3-3">选项3</el-menu-item> -->
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-share"></i>
                    <span>链接管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item
                      index="/AddLink"
                      @click="saveNavState('/' + 'AddLink')"
                      >分类管理</el-menu-item
                    >
                    <el-menu-item
                      index="/Link"
                      @click="saveNavState('/' + 'Link')"
                      >链接列表</el-menu-item
                    >
                    <!-- <el-menu-item index="4-3">选项3</el-menu-item> -->
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <div style="width: 180px"></div>
        <el-main>
          <!-- style="style:min-height:500px;background-color:red;overflow:scroll" -->
          <el-card shadow="always">
            <router-view />
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activePath: "welcome",
      flag: true,
      theme: "dark-mode2",
      color: "#000",
    };
  },
  watch: {
    color: function () {
      console.log(this.theme === "dark-mode2");
      return this.theme === "dark-mode2" ? "#fff" : "#000";
      // if(this.theme !== "dark-mode2"){
      //   return "#fff"
      // }else{
      //   return"#000"
      // }
    },
  },
  methods: {
    handleCommand() {
      this.$router.push("/");
       window.sessionStorage.removeItem("activePath")
       window.sessionStorage.setItem('token', '')
      this.$message.warning("你已退出，请重新登录");
    },
    changeTheme() {
      console.log(this.theme);
      if (this.theme === "dark-mode2") {
        this.theme = "";
      } else {
        this.theme = "dark-mode2";
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    // if(this.flag){
    //   this.$router.push(this.activePath);
    //   this.flag = false
    // }
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 60px;
  background-color: rgb(94, 105, 109);
  line-height: 60px;
  margin: 0;
  padding: 0;
  position: fixed;
  color: #fff;
  box-shadow: 0px 1px 3px #404041 !important;
  z-index: 99;
}

.el-header {
  padding: 0;
  z-index: 99;
}

.home-container {
  height: 100%;
  /* background-color: #ffc1fa; */
  overflow: hidden;
}
.el-header {
  /* background-color: #faf0af; */
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  /* color: #8bcdcd; */
  font-size: 25px;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header > div > img {
  max-width: 60px;
  border-radius: 50%;
}
.el-header > div > span {
  margin-left: 30px;
}

.el-dropdown {
  vertical-align: top;
  position: absolute;
  right: 20px;
}
.el-dropdown > img {
  width: 40px;
  border-radius: 50%;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
  color: #71b8f3;
  background-color: #6ac7f169;
}
.el-menu-item {
  /* padding: 0px; */
}

.el-submenu__title {
  /* padding-left: 20px; */
}

.el-submenu .el-menu-item {
  min-width: 198px;
}

.el-aside {
  position: fixed;
  height: 100%;
  background-color: #545c64;
  border-right: 1px solid #545c64;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 70px;
  height: 70px;
}

.el-menu {
  border-right: 1px solid #545c64;
}
.theme {
  display: none;
  position: fixed;
  top: 10px;
  right: 30px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: red;
  z-index: 99;
}
</style>
