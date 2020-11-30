
import store from "../store/index";
import { resetRouter } from "../config/router";
import Vue from "vue";
const common = {
    //清除项目所有内存、缓存数据
    clearData(clearCache) {
        store.commit("resetDynamicData");
        resetRouter();
        if (clearCache) {
            localStorage.clear();
            sessionStorage.clear();
        }
    },
}
export default common;
