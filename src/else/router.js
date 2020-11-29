import Vue from "vue";
import VueRouter from "vue-router"
import config from "../config/config";
Vue.use(VueRouter);
const createRouter = () => new VueRouter({
  mode: config.routerMode,
  base: config.baseUrl,
  routes: [
    {
      path: "/",
      name: "",
      component: () => import( /* webpackChunkName: "index" */ "_c/root/index.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import( /* webpackChunkName: "login" */ "_c/root/login.vue"),
    },
    {
      path: "/*",
      name: "404",
      component: () => import( /* webpackChunkName: "404" */ "_c/base/404.vue"),
    }
  ],
  linkActiveClass: "router-active"
})
//重置路由数据（一般权限路由重新登录需要此项操作）
const resetRouter = () => router && (router.matcher = createRouter().matcher);
const router = createRouter();
//全局路由钩子
router.beforeEach((to, from, next) => {
  console.log("from=====>", from, "\n", "to=====>", to);
  return next();
});
export { resetRouter };
export default router;