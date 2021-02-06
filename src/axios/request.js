//axios二次封装请求响应
import qs from "qs";
import Vue from 'vue';
import axios from 'axios';
import { cloneDeep } from "lodash-es";
import rootConfig from "../config/config";
import { reLogin } from "util/common";
axios.defaults.baseURL = rootConfig.projectRequestConfig["api"]["url"];
axios.defaults.timeout = process.env.NODE_ENV === "development" ? 0 : 15000;

/**
 * @description 取消有请求中的重复请求
 * @param {String} cancelType 
 * @param {Object} config 
 * @param {String} type 
 */
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
        Vue.prototype.pendingRequestArr = Vue.prototype.pendingRequestArr.filter(e => {
            const eurlArr = e.url.split(e.baseURL + "");
            const eUrl = eurlArr[eurlArr.length - 1];
            return !((eUrl === configUrl) && (e && !(type === 'cancel' && e.cancelRequest(config, cancelType))))
        });
    } else if (cancelType === "noPath") {//通过去掉path的url判断
        const url = configUrl.split("/").slice(0, -1).join("/");
        Vue.prototype.pendingRequestArr = Vue.prototype.pendingRequestArr.filter(e => {
            const eurlArr = e.url.split(e.baseURL + "");
            const eUrl = eurlArr[eurlArr.length - 1];
            return !((eUrl.split("/").slice(0, -1).join("/") === url) && (e && !(type === 'cancel' && e.cancelRequest(config, cancelType))))
        });
    } else if (cancelType === "url&data") {//通过 url+data 判断
        const isQ = config.trans2queryStr;
        const requestStr = configUrl + (isQ ? (config.data) : qs.stringify(JSON.parse(config.data || "{}"))) + qs.stringify(config.params || {});
        Vue.prototype.pendingRequestArr = Vue.prototype.pendingRequestArr.filter(e => {
            const eisQ = e.trans2queryStr;
            const eurlArr = e.url.split(e.baseURL + "");
            const eUrl = eurlArr[eurlArr.length - 1];
            return !(eUrl + (eisQ ? (e.data) : qs.stringify(e.data || {})) + qs.stringify(e.params || {}) === requestStr && (e && !(type === 'cancel' && e.cancelRequest(config, cancelType))))
        });
    }
    console.log("剩余pedding请求", Vue.prototype.pendingRequestArr);
}

/**
 * @description config 自定义属性说明
 * @param {String} config.serverTypeStr 区分服务器接口地址
 * @param {Boolean} config.noToken 是否不需要token
 * @param {Boolean} config.noOpenid 是否不需要openid
 * @param {Boolean} config.trans2queryStr 是否需要将data转换为queryString
 * @param {Boolean} config.hasSuccessNotify 是否需要添加成功notify
 * @param {Boolean} config.hasSuccessToast 是否需要添加成功Toast
 * @param {Boolean} config.withoutErrorMsg 是否不需要添加错误提示
 * @param {String} config.errorMsgType 错误提示类型 toast|notify
 * @param {String} config.successCode 成功码
 * @param {Boolean} config.hasGlobalLoading 是否需要添加全局加载状态
 * @param {String} config.loadingText 加载状态文字 hasGlobalLoading=true才生效
 */

//请求拦截器
axios.interceptors.request.use(config => {
    config.params = config.params || {};
    config.data = config.data || {};
    //区分请求服务器地址
    if (config.serverTypeStr) {
        config.baseURL = rootConfig.projectRequestConfig[config.serverTypeStr]["url"];
    }
    //隔离点请求是否需要 isolationToken isolationType
    if (config.serverTypeStr === "isolationApi") {
        if (!config.noIsolationToken) {
            const newtoken = sessionStorage.getItem('isolationToken');
            config.data["newtoken"] = newtoken;
        }
        if (!config.noIsolationType) {
            const type = sessionStorage.getItem('isolationType');
            config.data["type"] = type;
        }
        if (!config.noIsolationOpenid) {
            const openid = sessionStorage.getItem('openId');
            config.data["openid"] = openid;
        }
        if (!config.noToken) {
            const token = sessionStorage.getItem('tokenvalue');
            config.headers["token"] = token;
        }
        if (!config.noOpenid) {
            const openid = sessionStorage.getItem('openId');
            config.headers["openid"] = openid;
        }
    } else {
        //请求是否需要token
        if (!config.noToken) {
            const token = sessionStorage.getItem('tokenvalue');
            if (config.serverTypeStr === "bladeXApi") {
                config.headers["token"] = token;
            } else {
                config.data["token"] = token;
            }
        }
        //请求是否需要openid
        if (!config.noOpenid) {
            const openid = sessionStorage.getItem('openId');
            if (config.serverTypeStr === "bladeXApi") {
                config.headers["openid"] = openid;
            } else {
                config.data["openid"] = openid;
            }
        }
    }
    //是否需要转换data为queryString
    if (config.trans2queryStr) {
        config.data = qs.stringify(config.data);
    }
    //取消并发的重复请求
    config.cancelType && cancelPendingRquest(config.cancelType, config, "cancel");
    //加入pending请求数组
    config.cancelToken = new axios.CancelToken(c => {
        Vue.prototype.pendingRequestArr.push({
            ...(cloneDeep(config)),
            cancelRequest(config, type) {
                console.log(config && config.url + "请求被取消了", type);
                return c();
            }
        });
    })
    //是否需要全局加载动画
    if (config.hasGlobalLoading) {
        config.requestLoad = Vue.prototype.$toast.loading({ message: config.loadingText || "加载中" })
    }
    return config;
}, err => {
    console.log(err.request);
    err.config && err.config.requestLoad && err.config.requestLoad.clear();
    return Promise.reject(err);
})
//响应拦截器
axios.interceptors.response.use(res => {
    const config = res.config;
    //移除存储的正常请求
    cancelPendingRquest("url&data", config, "complete");
    //是否需要全局加载动画
    if (config.hasGlobalLoading) {
        config.requestLoad && config.requestLoad.clear();
    }
    const responseCodeObj = config.serverTypeStr ? rootConfig.projectRequestConfig[config.serverTypeStr] : rootConfig.projectRequestConfig["api"];

    if ((config.serverTypeStr === "isolationApi" && res.data[responseCodeObj.codeField] === 4011)) {
        //登录态失效
        reLogin("isolationLogin")
    } else if (res.data[responseCodeObj.codeField] === responseCodeObj["logoutCode"]) {
        //登录态失效
        reLogin()
    } else if (res.data[responseCodeObj.codeField] === config.successCode || responseCodeObj.successCodes.some(e => e === res.data[responseCodeObj.codeField])) {
        //判断code
        config.hasSuccessNotify && Vue.prototype.$notify({
            type: "success",
            message: res.data[responseCodeObj.msgField] || "成功啦",
            duration: 1500
        })
        config.hasSuccessToast && Vue.prototype.$toast.success({
            message: res.data[responseCodeObj.msgField] || "成功啦",
            duration: 1500
        })
    } else {
        if (!config.withoutErrorMsg) {
            config.errorMsgType === "notify" ? Vue.prototype.$notify({
                type: "warning",
                message: res.data[responseCodeObj.msgField] || "出错啦",
                duration: 3000,
            }) :
                Vue.prototype.$toast.fail({
                    message: res.data[responseCodeObj.msgField] || "出错啦",
                    duration: 3000,
                })
                ;
        }
    }
    return res;
}, err => {
    console.log(err);
    //移除存储的pedding请求
    if (err.response) {//服务器已经响应
        console.log(err.response);
    } else if (err.request) {//服务器没有响应
        console.log(err.request);
    } else {//请求发出时
        console.log('Error', err.message);
        const r = Vue.prototype.$toast.loading();
        r.clear();
    }
    console.log(err.config);
    err.config && cancelPendingRquest("url&data", err.config, "complete");
    err.config && err.config.requestLoad && err.config.requestLoad.clear();
    //登录失效设置
    if (err.response && (err.response.code === 401)) {
        reLogin()
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