import Vue from "vue";
import store from "../store/index";
import VueRouter from "vue-router"
import config from "../config/config";
import common from "../function/common";
Vue.use(VueRouter);
const createRouter = () => new VueRouter({
  mode: config.routerMode,
  base: config.baseUrl,
  routes: [
    {
      path: "/",
      name: "",
      component: () => import( /* webpackChunkName: "screen" */ "_c/root/screen.vue"),
    },
    {
      path: "/index",
      name: "index",
      component: () => import( /* webpackChunkName: "index" */ "_c/root/index.vue"),
      children: [
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import( /* webpackChunkName: "login" */ "_c/root/login.vue"),
    },
    {
      path: "/*",
      name: "404",
      component: () => import( /* webpackChunkName: "404" */ "_c/root/404.vue"),
    }
  ],
  linkActiveClass: "router-active" // 覆盖默认的路由高亮的类，默认的类叫做 router-link-active
})
//重置路由数据
const resetRouter = () => router && (router.matcher = createRouter().matcher);
const router = createRouter();
router.beforeEach((to, from, next) => {
  console.log("from=====>", from, "\n", "to=====>", to);
  if (from.name === "login" || to.name === "login") {
    common.clearData(from.name != "login");
  }
  if (to.name === "login" || to.name === "noPermission") {
    return next();
  } else {
    return next();
  }
});
export { resetRouter };
export default router;