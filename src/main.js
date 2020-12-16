//rem适配区间 viewport :[320,768]
window.addEventListener("DOMContentLoaded", () => {
    const docEl = document.documentElement;
    const vw = docEl.clientWidth;
    if (vw <= 320) {
        docEl.style.fontSize = "32px";
    } else if (vw >= 768) {
        docEl.style.fontSize = "76.8px";
    }
})
//Vue
import Vue from "vue";

//Mount（vue实例挂载公用属性方法）
import "./config/mount";
import "./filter/index";
import "./directive/index";

// Router Vuex
import router from "./config/router";
import store from "./store/index";

//Style
import "./style/main/reset.less";
import "./style/main/common.less";
import "./style/main/main.less";
import "./style/main/else-reset.less";

//Else
if (process.env.NODE_ENV === "test") {
    Promise.resolve().then(() => {
        const VConsole = require("vconsole");
        Vue.use(new VConsole())
    })
}

//RootComponent 
import app from "_c/app.vue";
new Vue({
    render(c) {
        return c(app);
    },
    router,
    store,
}).$mount("#app");