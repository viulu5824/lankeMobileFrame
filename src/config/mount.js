//vue全局挂载配置文件
import Vue from "vue";
import config from "./config";
import verify from "../util/verify";
import common from "../util/common";
import request from "../util/request";
import { assign } from "lodash-es";
import { Button, Toast, Notify, Icon, Image as VanImage, Loading, Dialog } from "vant";

Vue.use(Button).use(Toast).use(Notify).use(Icon).use(VanImage).use(Loading).use(Dialog);
Vue.use({
    install(Vue) {
        assign(Vue.prototype, { ...config, verify, ...common, $request: request })
    }
})