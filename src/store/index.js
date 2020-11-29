
import Vue from 'vue';
import Vuex from "vuex";
import _ from "lodash";
// import axios
import $axios from "../else/request";
import { TweenLite } from "gsap";
//全局静态数据
import staticData from "./static";
Vue.use(Vuex);
//全局动态数据
import dynamicData from "./dynamic";
const dynamicDataCopy = _.cloneDeep(dynamicData);

export default new Vuex.Store({
    strict: process.env.NODE_ENV === 'development',
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
        //数值动态变化
        numberAnimate: (state, payload) => {
            TweenLite.to(state, 0.5, {
                [payload.key]: payload.value
            });
        },
        //重置全局动态数据
        resetDynamicData: state => {
            Object.keys(dynamicData).forEach(key => {
                state[key] = dynamicDataCopy[key];
            })
        },
    },
    actions: {
        getCountryList({ commit, dispatch }) { 
            $axios({
                method: "post",
                url: "/common/countries",
                noToken: true,
            }).then(res => {
            }, err => {
                console.log(err);
            })
        }
    }
})