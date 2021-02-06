/**
 *@description vue全局挂载配置文件
 */
import Vue from "vue";
import config from "../config/config";
import request from "request";
import { assign } from "lodash-es";
import { Button, Toast, Notify, Icon, Image as VanImage, Loading, Dialog } from "vant";
//重置Toast.loading 默认配置
Toast.setDefaultOptions('loading', { forbidClick: true, duration: 0, message: "加载中" });

//重置
Vue.use(Button).use(Toast).use(Notify).use(Icon).use(VanImage).use(Loading).use(Dialog);
Vue.use({
    install(Vue) {
        Vue.prototype.pendingRequestArr = [];
        Vue.prototype.globalLoad = null;
        assign(Vue.prototype, { ...config, $request: request, _env: process.env.NODE_ENV })
    }
})