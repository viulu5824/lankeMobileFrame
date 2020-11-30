//vue全局挂载配置文件
import Vue from "vue";
import { Button, Toast, Notify } from "vant";
import config from "./config";
import verify from "../util/verify";
import common from "../util/common";
import request from "../util/request";
Vue.use(Button).use(Toast).use(Notify).use({
    install(Vue) {
        Vue.prototype.apiUrl = config.apiUrl;
        Vue.prototype.verify = verify;
        Vue.prototype._common = common;
        Vue.prototype.$request = request;
    }
})