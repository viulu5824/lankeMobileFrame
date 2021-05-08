/**
 * 核心配置文件
 * @description 配置 接口地址|图片地址|跳转地址|路由模式 
 *
 * @Object config 不同环境的核心配置信息
 * 
 * @param {Object} projectRequestConfig 请求和响应配置信息
 * 
 * @param {Object} projectRequestConfig.api api接口配置项
 * 
 * @param {Object} projectRequestConfig[key].url 请求接口地址
 * @param {Object} projectRequestConfig[key].successCodes 响应成功状态code数组
 * @param {Object} projectRequestConfig[key].msgField 响应message字段名称
 * @param {Object} projectRequestConfig[key].codeField 响应code字段名称
 * @param {Object} projectRequestConfig[key].logoutCode 响应登录失效code值
 * 
 * @param {String} projectBasePathvueRouter 路由Base配置
 * @param {String} projectRouteMode 路由模式
 * @param {String} projectImgPrefixUrl 线上图片拼接地址前缀
 * @param {String} projectJumpPrefixUrl 多页面跳转地址前缀
 * 
 * @export {Object} 对应环境的核心配置导出
 */
console.log(process.env.NODE_ENV);
const config = {
    //开发环境
    development: {
        projectRequestConfig: {
            api: {
                url: "http://localhost:5866/api1/",
                successCodes: [200],
                msgField: "statusMsg",
                codeField: "statusCode",
                logoutCode: 401
            },
            api2: {
                url: "http://localhost:5866/api2/",
                successCodes: [200],
                msgField: "statusMsg",
                codeField: "statusCode",
                logoutCode: 401
            },
        },
        projectBasePath: "/",
        projectRouteMode: "history",
        projectJumpPrefixUrl: '',
        projectImgPrefixUrl: ""
    },
    //测试环境
    test: {
        projectRequestConfig: {
            api: {
                url: "http://localhost:5866/api1/",
                successCodes: [200],
                msgField: "statusMsg",
                codeField: "statusCode",
                logoutCode: 401
            },
            api2: {
                url: "http://localhost:5866/api2/",
                successCodes: [200],
                msgField: "statusMsg",
                codeField: "statusCode",
                logoutCode: 401
            },
        },
        projectBasePath: "/",
        projectRouteMode: "history",
        projectJumpPrefixUrl: '',
        projectImgPrefixUrl: ""
    },
    //正式（生产）环境
    production: {
        projectRequestConfig: {
            api: {
                url: "http://localhost:5866/api1/",
                successCodes: [200],
                msgField: "statusMsg",
                codeField: "statusCode",
                logoutCode: 401
            },
            api2: {
                url: "http://localhost:5866/api2/",
                successCodes: [200],
                msgField: "statusMsg",
                codeField: "statusCode",
                logoutCode: 401
            },
        },
        projectBasePath: "/",
        projectRouteMode: "history",
        projectJumpPrefixUrl: '',
        projectImgPrefixUrl: ""
    },
}
export default config[process.env.NODE_ENV];