/**
 * request配置
 */
import Vue from 'vue';
import _ from "lodash";
import axios from 'axios';
import router from "./router";
import config from "../config/config";
import qs from "qs";
axios.defaults.baseURL = config.apiUrl;
axios.defaults.timeout = 8000;
Vue.prototype.pendingRequestArr = [];
let pendingRequestArr = Vue.prototype.pendingRequestArr,
    //取消pedding中的请求并删除
    cancelPendingRquest = (type, config) => {
        const urlArr = config.url.split(config.baseURL + "");
        const configUrl = urlArr[urlArr.length - 1];
        //判断请求是否重复并发
        if (type === "url") {//通过 url 判断
            pendingRequestArr = pendingRequestArr.filter(e => {
                const eurlArr = e.url.split(e.baseURL + "");
                const eUrl = eurlArr[eurlArr.length - 1];
                return !((eUrl === configUrl) && !(e && e.cancelRequest(config, type)))
            });
        } else if (type === "noPath") {//通过去掉path的url判断
            const url = configUrl.split("/").slice(0, -1).join("/");
            pendingRequestArr = pendingRequestArr.filter(e => {
                const eurlArr = e.url.split(e.baseURL + "");
                const eUrl = eurlArr[eurlArr.length - 1];
                return !((eUrl.split("/").slice(0, -1).join("/") === url) && !(e && e.cancelRequest(config, type)))
            });
        } else if (type === "url&data") {//通过 url+data 判断
            const isQ = config.trans2queryStr;
            const requestStr = configUrl + (isQ ? (config.data) : qs.stringify(JSON.parse(config.data || "{}"))) + qs.stringify(config.params || {});
            pendingRequestArr = pendingRequestArr.filter(e => {
                const eisQ = e.trans2queryStr;
                const eurlArr = e.url.split(e.baseURL + "");
                const eUrl = eurlArr[eurlArr.length - 1];
                return !(eUrl + (eisQ ? (e.data) : qs.stringify(e.data || {})) + qs.stringify(e.params || {}) === requestStr && !(e && e.cancelRequest(config, type)))
            });
        }
        console.log("剩余pedding请求", pendingRequestArr);
    },
    requestLoad, responseTitle, requestCount = 0;

// 请求拦截器
axios.interceptors.request.use(config => {
    config.params = _.cloneDeep(config.params) || {};
    config.headers["phone_id"] = "PC_Xd@12itZs";
    //请求是否需要token
    if (!config.noToken) {
        const access_token = localStorage.getItem('access_token');
        !access_token && pendingRequestArr[pendingRequestArr.length - 1] && pendingRequestArr[pendingRequestArr.length - 1]["cancelRequest"](config, "token") && router.push({ name: "login", query: { prev_route: router.currentRoute.name } });
        config.params["access_token"] = access_token;
    }
    //是否需要转换data为queryString
    if (config.trans2queryStr) {
        config.data = qs.stringify(config.data);
    }
    //取消并发的重复请求
    config.cancelType && cancelPendingRquest(config.cancelType, config);
    //加入pending请求数组
    config.cancelToken = new axios.CancelToken(c => {
        pendingRequestArr.push({
            ...(_.cloneDeep(config)),
            "cancelRequest"(config, type) {
                console.log(config && config.url + "请求被取消了", type);
                return c();
            }
        });
    })
    //是否需要全局加载动画
    if (config.hasGlobalLoading) {
        if (requestCount === 0) {
            requestLoad = Vue.prototype.$loading({
                text: "加载中",
                spinner: "el-icon-loading",
            })
        }
        requestCount++;
    }
    return config;
}, err => {
    console.log(err.request);
    requestLoad && requestLoad.close();
    return Promise.reject(err);
})
// 响应拦截器
axios.interceptors.response.use(res => {
    console.log(res);
    const config = res.config;
    //移除存储的pedding请求
    cancelPendingRquest("url&data", config);

    //是否需要全局加载动画
    if (config.hasGlobalLoading) {
        requestCount !== 0 && requestCount--;
        requestCount === 0 && requestLoad && requestLoad.close();
    }
    //区分文件下载
    if (res.config.downloadUrl) {
        console.log(typeof res.data === "object");
        if (typeof res.data === "object" && res.data.code !== 5000) {
            if (!responseTitle && !config.withoutErrorMsg) {
                responseTitle = Vue.prototype.$message.warning({
                    message: res.data.msg || "未知错误",
                    duration: 1500,
                    onClose() {
                        responseTitle = undefined;
                    }
                });
            }
        } else {

            const downloadUrl = url => {
                let iframe = document.createElement('iframe')
                iframe.style.display = 'none'
                iframe.src = url;
                document.body.appendChild(iframe);
                setTimeout(() => {
                        // document.body.removeChild(iframe);
                })
            }
            downloadUrl(config.downloadUrl);
        }
    } else {
        if (res.data.code === 5000) {
            if (!responseTitle) {
                responseTitle = config.hasSuccessMsg && Vue.prototype.$message.success({
                    message: res.data.msg || "成功了",
                    duration: 1500,
                    onClose() {
                        responseTitle = undefined;
                    }
                })
            }
        } else {
            if (!responseTitle && !config.withoutErrorMsg) {
                responseTitle = Vue.prototype.$message.warning({
                    message: res.data.msg || "未知错误",
                    duration: 1500,
                    onClose() {
                        responseTitle = undefined;
                    }
                });
            }
        }
    }
    return res;
}, err => {
    //移除存储的pedding请求
    err.response && cancelPendingRquest("url&data", err.response.config);
    requestCount !== 0 && requestCount--;
    requestCount === 0 && requestLoad && requestLoad.close();
    if (err.response && err.response.status === 401) {
        Vue.prototype.$message.error({
            message: "登录状态失效",
            duration: 3000
        })
        router.push({ name: "login", query: { prev_route: router.currentRoute.name } });
    } else {
        err.message && Vue.prototype.$message.error({
            message: err.code === "ECONNABORTED" ? "请求超时" : err.message,
            duration: 3000
        })
    }
    return Promise.reject(err)
})
export default axios;