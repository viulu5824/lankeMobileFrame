//polyfill
import "core-js/stable";
import "regenerator-runtime/runtime";

//设置rem适配区间 viewport :[320,768]
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
import "mount";
import "request";
import "./filter/index";
import "./directive/index";

// Router Vuex
import store from "./store/index";
import router from "router";

//Style
import "./style/main/reset.less";
import "./style/main/common.less";
import "./style/main/main.less";
import "./style/main/else-reset.less";

//Else
if (process.env.NODE_ENV === "test") {
    import(/* webpackChunkName: 'vconsole' */ 'vconsole').then((VConsole) => {
        console.log(VConsole);
        const vc = new VConsole.default();
        let first = true;
        Object.defineProperty(window, "cc", {
            get() {
                if (first) {
                    first = false;
                } else {
                    vc.destroy();
                }

            }
        })
    }).catch(err => console.error(err))
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