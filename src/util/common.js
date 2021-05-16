
import store from "store";
import qs from "qs";
import $request from "request";
import router from "router";
import { resetRouter } from "router";
import { ImagePreview, Dialog } from "vant";
import rootConfig from "../config/config"

/**
 * @description  清除项目所有内存、缓存数据
 * @param {Boolean} clearCache 是否清除缓存
 */
export function clearData(clearCache) {
    store.commit("resetDynamicData");
    resetRouter();
    if (clearCache) {
        localStorage.clear();
        sessionStorage.clear();
    }
}

/**
 * @description  vant预览图片
 * @param {Object} options
 * @param {Number} options.needPrefix 是否需要添加前缀
 * @param {String} options.projectImgPrefixUrl 图片前缀
 */
export function previewImage({ images, ...config }) {
    if (images) {
        if (config.needPrefix) {
            images = images.map(e => rootConfig.projectImgPrefixUrl + e);
        }
        ImagePreview({ ...config, images });
    }
}

/**
 * @description  跳转链接
 * @param {Object} options
 * @param {Number} options.path 跳转路径
 * @param {Boolean} options.isReplace 是否覆盖历史记录
 * @param {Object} options.queryObj 携带查询字符串对象
 * @param {String} options.rootPath 跳转链接域名根路径
 */
export function jumpToUrl({ path, isReplace, queryObj = {}, rootPath = rootConfig.projectJumpPrefixUrl } = {}) {
    const href = rootPath + path + `?${qs.stringify(queryObj)}&t=` + new Date().getTime();
    isReplace ? window.location.replace(href) : window.location.assign(href)
}

/**
 * @description base64转file对象
 * @param {*} dataurl 
 * @param {*} filename 
 */

export function dataURLtoFile(dataurl, filename = "filename") {
    const arr = dataurl.split(',');
    console.log(arr);
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    console.log(mime);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
/**
 * @description base64去除头信息
 * @param {*} dataurl 
 */

export function removeBase64Head(dataurl) {
    return dataurl.replace(/^data:image\/\w+;base64,/, "");
}

/**
 * @description file转换成dataUrl
 * @param {Object} file file对象
 * @argument {String} res url结果
 */
export function file2DataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (e) {
            reject(e);
        };
        reader.readAsDataURL(file);
    })
}

/**
 * @description file转换成image对象
 * @param {Object} file file对象
 * @param {Function} callback 回调函数
 * @argument {String} res image对象
 */
export function file2Image(file, callback) {
    var image = new Image();
    var URL = window.webkitURL || window.URL;
    if (URL) {
        var url = URL.createObjectURL(file);
        image.onload = function () {
            callback(image);
            URL.revokeObjectURL(url);
        };
        image.src = url;
    } else {
        file2DataUrl(file, function (dataUrl) {
            image.onload = function () {
                callback(image);
            }
            image.src = dataUrl;
        });
    }
}

/**
 * @description dataUrl转换成image对象
 * @param {String} url url
 * @param {Function} callback 回调函数
 * @argument {String} res image对象
 */
export function url2Image(url, callback) {
    var image = new Image();
    image.src = url;
    image.onload = function () {
        callback(image);
    }
}

/**
 * @description image对象转换成canvas
 * @param {Object} image image对象
 */
export function image2Canvas(image) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
}

/**
 * @description canvas对象转换成DataUrl
 * @param {*} canvas canvas实例对象
 * @param {*} quality 图片质量
 * @param {*} type 图片类型
 */
export function canvas2DataUrl(canvas, quality, type) {
    return canvas.toDataURL(type || 'image/jpeg', quality || 0.8);
}

/**
 * @description dataUrl转换成blob
 * @param {String} dataUrl 
 * @param {String} type 
 */
export function dataUrl2Blob(dataUrl, type) {
    var data = dataUrl.split(',')[1];
    var mimePattern = /^data:(.*?)(;base64)?,/;
    var mime = dataUrl.match(mimePattern)[1];
    var binStr = atob(data);
    var arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type || mime });
}

/**
 * @description canvas转换成blob
 * @param {*} canvas 
 * @param {*} callback 
 * @param {*} quality 
 * @param {*} type 
 */
export function canvas2Blob(canvas, callback, quality, type) {
    canvas.toBlob(function (blob) {
        callback(blob);
    }, type || 'image/jpeg', quality || 0.8);
}

/**
 * @description blob转换成dataurl
 * @param {*} canvas 
 * @param {*} callback 
 */
export function blob2DataUrl(blob, callback) {
    file2DataUrl(blob, callback);
}

/**
 * @description 重载当前路由
 */
export function reloadCurrentRoute() {
    router.push({ name: "refresh" })
}

/**
 * @description 登录态失效重新登录
 */
export function reLogin(route) {
    Dialog.confirm({
        title: "提示",
        message: route ? "登录失效，请重新登录" : "令牌不正确，请退出小程序重新进入",
        confirmButtonText: "重新登录",
        cancelButtonText: "返回首页",
        beforeClose(action, done) {
            if (action === "confirm") {
                if (route) {
                    done();
                    router.push({ name: route })
                } else {
                    $request({
                        url: "verifyCode/wxLogin.do",
                        method: "post",
                        serverTypeStr: "fuseApi",
                        noToken: true,
                        trans2queryStr: true,
                        hasSuccessToast: true,
                        data: {
                            mobile: store.state.basicData.mobile,
                            openid: store.state.basicData.openid,
                            type: 2  //是否首次登录  1是 2否
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.data.statusCode == 2002) {
                            sessionStorage.setItem("tokenvalue", res.data.data.token);
                            reloadCurrentRoute();
                            done();
                        } else {
                            done(false);
                        }
                    }, (err) => {
                        console.log(err);
                        done(false);
                    })
                }
            } else {
                done();
            }
        }
    }).catch(() => {
        jumpToUrl({
            path: "realname/serve/html/cityindex.html"
        })
    })
}

/**
 * @description select下拉赋值name
 * @param {Object} obj 
 * @param {Object} obj.target 源对象 
 * @param {"Object"} obj.list 列表数据 
 * @param {Object} obj.targetCodeField 源对象code字段 
 * @param {Object} obj.targetNameField 源对象name字段 
 * @param {Object} obj.listCodeField 列表code字段 
 * @param {Object} obj.listNameField 列表name字段
 */
export function selectChange(
    { target = {},
        list = [],
        targetCodeField = "",
        targetNameField = "",
        listCodeField = "zd_code",
        listNameField = "zd_name"
    }
) {
    const item = list.find(
        (e) => e[listCodeField] === target[targetCodeField]
    );
    target[targetNameField] = item ? item[listNameField] : null;
}
/**
 * @description 身份证 X 转大写
 */
export function upperIdcard(e) {
    if ((e || "").trim()) {
        return e.toUpperCase();
    } else {
        return "";
    }
}

/**
 * 获取本地json单个字典
 * @param {String} products 字典文件名称/vuex Key
 */

//获取单个字典项
export function getDictionariesData(key) {
    //已经获取过字典
    if (store.state[key].length) {
        return true
        //未获取过字典值
    } else {
        return $request({
            baseURL: "/",
            method: "get",
            url: `${rootConfig.projectBasePath === "/" ? "/" : rootConfig.projectBasePath + "/"}static/json/${key}.json`,
            withoutErrorMsg: true
        }).then(res => {
            store.commit(key, res.data || [])
        })
    }
}