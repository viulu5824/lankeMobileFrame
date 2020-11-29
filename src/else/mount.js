//vue全局挂载配置文件
import Vue from "vue";
import { Button, Toast, Notify } from "vant";
import config from "../config/config";
import verify from "../function/verify";
import common from "../function/common";
import request from "./request";
Vue.use(Button).use(Toast).use(Notify).use({
    install(Vue) {
        Vue.prototype.apiUrl = config.apiUrl;
        Vue.prototype.verify = verify;
        Vue.prototype._common = common;
        Vue.prototype.$request = request;
    }
})