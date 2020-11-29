
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

//Scripts
import "./else/mount";
import "./else/request";
import "./function/filter";

//ElementUI Router Vuex
import "./else/vant-ui";
import router from "./else/router";
import store from "./store/index";

//Style
import "./less/main/base.less";
import "./less/main/reset.less";
import "./less/main/common.less";
import "./less/main/main.less";
import "./less/else/else-reset.less";
//Amap


//RootComponent 
import app from "./components/app.vue";
new Vue({
    render(c) {
        return c(app);
    },
    router,
    store,

}).$mount("#app");