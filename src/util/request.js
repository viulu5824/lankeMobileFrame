//axios二次封装请求响应
import Vue from 'vue';
import qs from "qs";
import { cloneDeep } from "lodash-es";
import axios from 'axios';
import router from "../config/router";
import rootConfig from "../config/config";


Vue.prototype.pendingRequestArr = [];
axios.defaults.baseURL = rootConfig.apiUrl.api;
axios.defaults.timeout = 12000;
let pendingRequestArr = Vue.prototype.pendingRequestArr, requestLoad;

//取消请求中的请求重复
let cancelPendingRquest = (cancelType, config, type = "cancel") => {
    if (!config) {
        return;
    }
    if (config.data instanceof FormData) {
        cancelType = "url"
    }
    const urlArr = config.url.split(config.baseURL + "");
    const configUrl = urlArr[urlArr.length - 1];
    //判断请求是否重复并发
    if (cancelType === "url") {//通过 url 判断
        pendingRequestArr = pendingRequestArr.filter(e => {
            const eurlArr = e.url.split(e.baseURL + "");
            const eUrl = eurlArr[eurlArr.length - 1];
            return !((eUrl === configUrl) && (e && !(type === 'cancel' && e.cancelRequest(config, cancelType))))
        });
    } else if (cancelType === "noPath") {//通过去掉path的url判断
        const url = configUrl.split("/").slice(0, -1).join("/");
        pendingRequestArr = pendingRequestArr.filter(e => {
            const eurlArr = e.url.split(e.baseURL + "");
            const eUrl = eurlArr[eurlArr.length - 1];
            return !((eUrl.split("/").slice(0, -1).join("/") === url) && (e && !(type === 'cancel' && e.cancelRequest(config, cancelType))))
        });
    } else if (cancelType === "url&data") {//通过 url+data 判断
        const isQ = config.trans2queryStr;
        const requestStr = configUrl + (isQ ? (config.data) : qs.stringify(JSON.parse(config.data || "{}"))) + qs.stringify(config.params || {});
        pendingRequestArr = pendingRequestArr.filter(e => {
            const eisQ = e.trans2queryStr;
            const eurlArr = e.url.split(e.baseURL + "");
            const eUrl = eurlArr[eurlArr.length - 1];
            return !(eUrl + (eisQ ? (e.data) : qs.stringify(e.data || {})) + qs.stringify(e.params || {}) === requestStr && (e && !(type === 'cancel' && e.cancelRequest(config, cancelType))))
        });
    }
    console.log("剩余pedding请求", pendingRequestArr);
}


//配置请求拦截器
axios.interceptors.request.use(config => {
    config.params = config.params || {};
    config.data = config.data || {};
    //区分请求服务器地址
    if (config.serverTypeStr) {
        config.baseURL = rootConfig.apiUrl[config.serverTypeStr];
    }
    //请求是否需要token
    if (!config.noToken) {
        const token = sessionStorage.getItem('tokenvalue');
        config.data["token"] = token;
    }
    //请求是否需要openid
    if (!config.noOpenid) {
        const openid = sessionStorage.getItem('openId');
        config.data["openid"] = openid;
    }
    //是否需要转换data为queryString
    if (config.trans2queryStr) {
        config.data = qs.stringify(config.data);
    }
    //取消并发的重复请求
    config.cancelType && cancelPendingRquest(config.cancelType, config, "cancel");
    //加入pending请求数组
    config.cancelToken = new axios.CancelToken(c => {
        pendingRequestArr.push({
            ...(cloneDeep(config)),
            cancelRequest(config, type) {
                console.log(config && config.url + "请求被取消了", type);
                return c();
            }
        });
    })
    //是否需要全局加载动画
    if (config.hasGlobalLoading) {
        requestLoad = Vue.prototype.$toast.loading({
            message: "加载中...",
            duration: 0,
            forbidClick: true
        })
    }
    return config;
}, err => {
    console.log(err.request);
    requestLoad && requestLoad.clear();
    return Promise.reject(err);
})
// 配置响应拦截器
axios.interceptors.response.use(res => {
    console.log(res.data);
    const config = res.config;
    //移除存储的正常请求
    cancelPendingRquest("url&data", config, "complete");

    //是否需要全局加载动画
    if (config.hasGlobalLoading) {
        requestLoad && requestLoad.clear();
    }
    //判断是否请求成功
    if ((res.data.statusCode === config.successCode) || rootConfig.successCodeArr.some(e => e === res.data.statusCode)) {//5002 1053
        config.hasSuccessMsg && Vue.prototype.$toast.success({
            message: res.data.msg || "成功了",
            duration: 1500
        })
    } else {
        if (!config.withoutErrorMsg) {
            Vue.prototype.$notify({
                type: "warning",
                message: res.data.statusMsg || "未知错误",
                duration: 1500,
            });
        }
    }
    return res;
}, err => {
    //移除存储的pedding请求
    if (err.response) {//服务器已经响应
        console.log(err.response);
    } else if (err.request) {//服务器没有响应
        console.log(err.request);
    } else {//请求发出时
        console.log('Error', err.message);
    }
    console.log(err.config);
    cancelPendingRquest("url&data", err.config, "complete");
    requestLoad && requestLoad.clear();
    //登录失效设置
    if (err.response && err.response.status === 401) {
        Vue.prototype.$toast.fail({
            message: "登录状态失效",
            duration: 3000
        })
        router.push({ name: "login", query: { prev_route: router.currentRoute.name } });
    } else {
        err.message && Vue.prototype.$notify({
            type: "danger",
            message: err.code === "ECONNABORTED" ? "请求超时" : err.message,
            duration: 3000
        })
    }
    return Promise.reject(err)
})
export default axios;