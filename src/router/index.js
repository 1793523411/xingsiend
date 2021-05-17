import Vue from "vue";
import VueRouter from "vue-router";

const Login = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ "../components/login/Login.vue"
  );
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "../components/Home.vue");
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ "../components/article/Article.vue"
  );
const Editor = () =>
  import(
    /* webpackChunkName: "editor_article" */ "../components/editor/Editor.vue"
  );
const Article = () =>
  import(
    /* webpackChunkName: "editor_article" */ "../components/article/Article.vue"
  );
const Swiper = () =>
  import(
    /* webpackChunkName: "Swiper_Wall" */ "../components/image/Swiper.vue"
  );
const Wall = () =>
  import(/* webpackChunkName: "Swiper_Wall" */ "../components/image/Wall.vue");
const Lun = () =>
  import(/* webpackChunkName: "Swiper_Wall" */ "../components/image/AddImg.vue");
const AddImg = () =>
  import(
    /* webpackChunkName: "Swiper_Wall" */ "../components/image/AddImg.vue"
  );
const History = () =>
  import(
    /* webpackChunkName: "Swiper_Wall" */ "../components/history/History.vue"
  );
const AddHistory = () =>
  import(
    /* webpackChunkName: "Swiper_Wall" */ "../components/history/AddHistory.vue"
  );
const Link = () =>
  import(/* webpackChunkName: "Swiper_Wall" */ "../components/link/Link.vue");
const AddLink = () =>
  import(
    /* webpackChunkName: "Swiper_Wall" */ "../components/link/AddLink.vue"
  );
0;
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: Welcome },
      { path: "/editor", component: Editor },
      { path: "/article", component: Article },
      { path: "/swiper/:id", component: Swiper },
      { path: "/wall", component: Wall },
      { path: "/lun", component: Lun },
      { path: "/addimg", component: AddImg },
      { path: "/History", component: History },
      { path: "/AddHistory", component: AddHistory },
      { path: "/Link", component: Link },
      { path: "/AddLink", component: AddLink },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();

  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
