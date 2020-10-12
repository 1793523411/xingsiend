<template>
  <div id="app" class="html" :theme="theme">
    <div @click="changeTheme" class="theme" :style="{backgroundColor:color}"></div>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      theme: "",
      color:'#000'
    };
  },
  watch:{
    color : function () {
      console.log(this.theme==='dark-mode')
      return this.theme === 'dark-mode'?'#fff':'#000'
      // if(this.theme !== "dark-mode"){
      //   return "#fff"
      // }else{
      //   return"#000"
      // }
    }
  },
  methods: {
    changeTheme() {
      // console.log(this.theme)
      if(this.theme === "dark-mode"){
        this.theme = ''
      }else{
        this.theme = "dark-mode"
      }
    },
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.theme{
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
