const NODE_ENV = process.env.NODE_ENV;
console.log(NODE_ENV);
switch (NODE_ENV) {
    case "production":
        window.apiUrl = "";
        break;
    default:
        window.apiUrl = "";
        break;
}
/**
 * @param  apiUrl:接口地址对象
 * @param  baseUrl:vueRouter baseUrl配置
 * @param  routerMode:vueRouter 路由模式
 * @param  successCode:请求成功code
 */
const config = {
    development: {
        apiUrl: {
            "api": ""
        },
        baseUrl: "/",
        routerMode: "hash",
        openRootUrl: "",
        successCodeArr: [5002, 1053],
        imgUrl: ""
    },
    test: {
        apiUrl: {
            "api": "",
        },
        baseUrl: "/",
        routerMode: "hash",
        openRootUrl: "",
        successCodeArr: [5002, 1053],
        imgUrl: ""
    },
    production: {
        apiUrl: {
            "api": "",
        },
        baseUrl: "/",
        routerMode: "history",
        openRootUrl: "",
        successCodeArr: [5002, 1053],
        imgUrl: ""
    },
}
export default config[NODE_ENV];