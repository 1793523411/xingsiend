import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";

import "@/assets/css/global.css";
import "@/assets/css/reset.css";
import "@/assets/font-awesome-4.7.0/css/font-awesome.min.css";

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// require styles 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from "axios";

import moment from "moment";

Vue.prototype.$moment = moment;

Vue.prototype.$theme = "dark-mode"

axios.defaults.baseURL = "http://39.101.140.225:8080";


axios.interceptors.request.use((config) => {
  NProgress.start();
  let tokenStr = window.sessionStorage.getItem("token");
  window.sessionStorage.getItem("token");
  config.headers.Authorization = tokenStr;
  return config;
});

axios.interceptors.response.use((config) => {
  NProgress.done();
  return config;
});

Vue.use(ElementUI);

Vue.prototype.$http = axios;

Vue.use(VueQuillEditor);

Vue.config.productionTip = false;

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
