//Vuex配置文件
import Vue from 'vue';
import Vuex from "vuex";
import { cloneDeep } from "lodash-es";

//全局静态数据
import staticData from "./static";

//全局动态数据
import dynamicData from "./dynamic";
const dynamicDataCopy = cloneDeep(dynamicData);

Vue.use(Vuex);
export default new Vuex.Store({
    strict:false,
    state: { ...staticData, ...dynamicData },
    getters: {
    },
    mutations: {
        //统一赋值的mutation
        ...Object.keys(dynamicData).reduce((obj, key) => {
            return {
                ...obj,
                [key]: (state, payload) => state[key] = payload,
            }
        }, {}),
        //重置全局动态数据
        resetDynamicData: state => {
            Object.keys(dynamicData).forEach(key => {
                state[key] = dynamicDataCopy[key];
            })
        },
    },
    actions: {
    }
})