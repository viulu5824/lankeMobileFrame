//Vuex配置文件
import Vue from 'vue';
import Vuex from "vuex";
import { cloneDeep } from "lodash-es";
import { isIphone } from "util/environment";
import { getDictionariesData } from "util/common";
const wx = require("weixin-js-sdk");

//全局静态数据
import staticData from "./static";

//全局动态数据
import dynamicData from "./dynamic";
import $request from 'request';
const dynamicDataCopy = cloneDeep(dynamicData);
Vue.use(Vuex);
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
        //重置全局动态数据
        resetDynamicData: state => {
            Object.keys(dynamicData).forEach(key => {
                state[key] = dynamicDataCopy[key];
            })
        },
    },
    actions: {
        /**
        * @description 获取微信jsSdk授权
        */
        getWxSign({ commit, state }) {
            return new Promise((resolve, reject) => {
                if (isIphone && state.isGetWxSign) {
                    return resolve();;
                }
                $request({
                    method: "post",
                    url: "wechat/getSign.do",
                    serverTypeStr: "fuseApi",
                    noToken: true,
                    noOpenid: true,
                    data: { url: isIphone ? state.href : location.href.split("#")[0] },
                    withoutErrorMsg: true,
                    cancelType: "url"
                }).then((res) => {
                    console.log(res);
                    if (res.data.status == 1) {
                        let isError = false;
                        wx.config({
                            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            debug: false,
                            // 必填，公众号的唯一标识
                            appId: "wx46bc756755593bf5",
                            // 必填，生成签名的时间戳
                            timestamp: res.data.data.timestamp,
                            // 必填，生成签名的随机串
                            nonceStr: res.data.data.noncestr,
                            // 必填，签名，见附录1
                            signature: res.data.data.signature,
                            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            jsApiList: [
                                "checkJsApi",
                                "scanQRCode",
                                "chooseImage",
                                "chooesVideo",
                                "getLocalImgData",
                                "openLocation",
                                "getLocation",
                            ],
                        });
                        wx.error(function (err) {
                            isError = true;
                            commit("isGetWxSign", false);
                            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                            console.log("wx.error:调取微信接口失败", err);
                            reject(err);
                        });
                        wx.ready(() => {
                            console.log("wx:ready");
                            if (isError) {
                                return;
                            }
                            commit("isGetWxSign", true);
                            resolve(res);
                        })
                    } else {
                        Vue.prototype.$notify({ message: "调取微信接口失败", type: "danger" });
                        reject(err);
                    }
                }, err => {
                    console.log("getWxSign Error", err);
                    reject(err);
                });
            })
        },
        /**
         * @description 同时获取多个字典项
         * @param {Array} products [字典文件名称/vuex Key]
         */
        getDictionariesDatas({ }, products = []) {
            console.log(products);
            return $request.all(products.map(e => getDictionariesData(e)))
        }
    }
})