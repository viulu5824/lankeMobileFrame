/**
 * @description vue-router配置文件
 */

import Vue from "vue";
import store from "../store/index";
import VueRouter from "vue-router"
Vue.use(VueRouter);

import config from "../config/config";
import { isAndroid } from "util/environment";
import { routerList as children } from "./router.js";
//配置路由信息
const createRouter = () => new VueRouter({
    mode: config.projectRouteMode,
    base: config.projectBasePath,
    routes: [
        {
            path: "/",
            component: () => import( /* webpackChunkName: "index" */ "_c/main/index.vue"),
            redirect: "/login",
            children
        },
        {
            path: "/login",
            name: "login",
            component: () => import( /* webpackChunkName: "404" */ "_c/main/login.vue"),
        },
        {
            path: "/*",
            name: "404",
            component: () => import( /* webpackChunkName: "404" */ "_c/error/404.vue"),
        },
    ],
    //默认滚动条
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    //路由激活元素类名
    linkActiveClass: "router-active"
})

//初始化路由
const router = createRouter();
//全局路由钩子
router.beforeEach((to, from, next) => {
    console.log("Router-Form:", from, "\n", "Router-To:", to);
    //切换路由清除 pedding请求
    Vue.prototype.pendingRequestArr = Vue.prototype.pendingRequestArr.filter(e => {
        e.cancelRequest()
        console.log(e);
        e.requestLoad && e.requestLoad.clear();
        return false;
    })
    //安卓系统切换路由重置微信sdk请求状态
    if (isAndroid) {
        store.commit('isGetWxSign', false);
    }
    //Vuex存储当前路由
    store.commit("currentRoute", to.name);
    return next()
});
router.afterEach((to) => {
    //切换路由修改HTML title标签
    if (to.meta.title) {
        document.title = to.meta.title
    }
})
//导出重置路由数据方法（一般权限路由重新登录需要此项操作）
export const resetRouter = () => router && (router.matcher = createRouter().matcher);
export default router;