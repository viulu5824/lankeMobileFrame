/**
 * 注册路由列表
 */
export const routerList =
  [
    //中间刷新页
    {
      meta: {
        title: '加载中...'
      },
      path: "/refresh",
      name: "refresh",
      component: () => import( /* webpackChunkName: "refresh" */ "_c/common/refresh.vue"),
    },
    //首页
    {
      meta: {
        title: '首页'
      },
      path: "/index",
      name: "index",
      component: () => import( /* webpackChunkName: "more" */ "_c/view/index/index.vue"),

    },
    //地图选点公用组件
    {
      meta: {
        title: '地图选点'
      },
      path: "/setLocation",
      name: "setLocation",
      component: () => import( /* webpackChunkName: "setLocation" */ "_c/common/setLocation.vue"),

    },
  ]