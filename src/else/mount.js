import Vue from "vue";
import config from "../config/config";
import verify from "../function/verify";
import common from "../function/common";
import axios from "./request";
Vue.use({
    install(Vue) {
        Vue.prototype.apiUrl = config.apiUrl;
        Vue.prototype.socketUrl = config.socketUrl;
        Vue.prototype.videoUrlPrefix = "http://192.168.1.201:83/";
        Vue.prototype.imgUrl = "http://47.52.234.122:8088";
        Vue.prototype.verify = verify;
        Vue.prototype._common = common;
        Vue.prototype.$axios = axios;
    }
})