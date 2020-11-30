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
import "./config/mount";
import "./util/request";
import "./util/filter";

// Router Vuex
import router from "./config/router";
import store from "./store/index";

//Style
import "./style/main/reset.less";
import "./style/main/common.less";
import "./style/main/main.less";
import "./style/main/else-reset.less";

//RootComponent 
import app from "./components/app.vue";
new Vue({
    render(c) {
        return c(app);
    },
    router,
    store,

}).$mount("#app");