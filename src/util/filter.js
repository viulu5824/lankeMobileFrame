//Vue过滤器函数
import Vue from "vue";
import _ from 'lodash';
//列表转树结构过滤器
Vue.filter("list2tree", function (listData = [], {
    topLabelName = "name",
    topParentName = "parent",
    topIdName = "id",
    topCustomFieldArr = [],
    remainLength = 0,
    rootParentFilter = "!e.parent",
    childFilter = "false",
    listName = "childList",
    hasChildEmptyArr = true
} = {}, {
    childLabelName = "name",
    childParentName = "parent",
    childIdName = "id",
    childCustomDataArr = [],
} = {}) {
    listData = _.cloneDeep(listData)
    let TreeData = [];
    //先筛选一次list,将最高级数据放入TreeData
    listData.filter(e => {
        if (eval(rootParentFilter)) {
            let customData = {};
            let obj = {
                ...(topCustomFieldArr.reduce((prev, cur) => {
                    return { [cur]: e[cur], ...prev };
                }, customData)),
                label: e[topLabelName],
                parent: e[topParentName],
                id: e[topIdName],
                children: []
            };
            //如果有根子级，直接放入
            e[listName] && e[listName].length > 0 && putChildList(obj, e[listName]);
            TreeData.push(obj);
            return false;
        }
    })
    //递归构成树结构
    function toTree(data) {
        data.forEach((dataItem, i) => {
            listData.filter(item => {
                if (dataItem[topIdName] === item[topParentName]) {
                    if (eval(childFilter)) {
                        return false;
                    }
                    let customData = {};
                    let obj = {
                        ...(topCustomFieldArr.reduce((prev, cur) => {
                            return { [cur]: item[cur], ...prev };
                        }, customData)),
                        label: item[topLabelName],
                        parent: item[topParentName],
                        id: item[topIdName],
                        children: []
                    };
                    //如果有根子级，直接放入
                    item[listName] && item[listName].length > 0 && putChildList(obj, item[listName]);
                    _.cloneDeep(obj, item);
                    dataItem.children.push(obj);
                    return false;
                }
            })
            //递归至剩余几项
            if (listData.length > remainLength) {
                toTree(data[i].children);
            }
        })
    }
    //根子级列表，直接放入
    function putChildList(parentObj = {}, childList = []) {
        childList.forEach((childItem) => {
            let customData = {};
            let cobj = {
                ...childCustomDataArr.reduce((prev, cur) => {
                    return { [cur]: childItem[cur], ...prev };
                }, customData),
                id: childItem[childIdName],
                parent: childItem[
                    childParentName
                ],
                label: childItem[childLabelName],
                children: []
            };
            parentObj.children.push(cobj);
        })
    }
    //所有children空数组变为undefined
    function clearNullArray(data = []) {
        data.forEach(e => {
            if (e.children.length < 1) {
                e.children = undefined;
            } else {
                clearNullArray(e.children);
            }
        })
    }
    toTree(TreeData), !hasChildEmptyArr && clearNullArray(TreeData);
    return TreeData;
});
//时间格式化过滤器
Vue.filter("yyyyMMddhhmmss", function (value = new Date(), dateSeparator = "-", timeSeparator = ":") {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return y + dateSeparator + MM + dateSeparator + d + ' ' + h + timeSeparator + m + timeSeparator + s;
});
Vue.filter("yyyyMMdd", function (value = new Date(), dateSeparator = "-") {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let dd = date.getDate();
    dd = dd < 10 ? ('0' + dd) : dd;
    return y + dateSeparator + MM + dateSeparator + dd;
});
Vue.filter("yyyyMM", function (value = new Date(), dateSeparator = "-") {
    let date = new Date(value);
    let yyyy = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let dd = date.getDate();
    dd = dd < 10 ? ('0' + dd) : dd;
    return yyyy + dateSeparator + MM;
});
Vue.filter("hhmmss", function (value = new Date(), timeSeparator = ":") {
    let date = new Date(value);
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return h + timeSeparator + m + timeSeparator + s;
});
//坐标系转换过滤器
Vue.filter("wgs84ToGcj02", function ([lng, lat] = [], isWgs84 = false) {
    const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    const PI = 3.1415926535897932384626;
    const a = 6378245.0;
    const ee = 0.00669342162296594323;
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    if (isWgs84) {//wgs84ToGcj02
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = lat / 180.0 * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        let mglat = lat + dlat;
        let mglng = lng + dlng;
        return [mglng, mglat];
    } else {//gcj02ToWgs84
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = lat / 180.0 * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
    //转换纬度
    function transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    }
    //转换经度
    function transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    }

    //判断是否在国内，不在国内则不做偏移
    function out_of_china(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }

});

//色值转换
Vue.filter("rgb2hex", function (rgb) {
    rgb = rgb.match(/\d+/g);
    function hex(x) { return ("0" + parseInt(x).toString(16)).slice(-2); }
    return rgb = "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
});
Vue.filter("hex2rgb", function (hex) {
    hex = hex.match(/[\d\w]{2}/g);
    function rgb(x) { return parseInt(x, 16); }
    return hex = "rgb(" + rgb(hex[0]) + "," + rgb(hex[1]) + "," + rgb(hex[2]) + ")";
});
//颜色过渡
Vue.filter("gradient", function ({ rgbStart, rgbEnd, numStart, numEnd, thisNum, numStep = 1 } = {}) {
    let rgbStartArr = rgbStart.match(/\d+/g);
    let rgbStartR = rgbStartArr[0];
    let rgbStartG = rgbStartArr[1];
    let rgbStartB = rgbStartArr[2];

    let rgbEndArr = rgbEnd.match(/\d+/g);
    let rgbEndR = rgbEndArr[0];
    let rgbEndG = rgbEndArr[1];
    let rgbEndB = rgbEndArr[2];
    let numDiff = (numEnd - numStart) / numStep;
    let thisNumDiff = Math.floor((thisNum - numStart) / numStep);
    let thisNumPct = thisNumDiff / numDiff;
    rgbR = rgbStartR * 1 + parseInt((rgbEndR - rgbStartR) * thisNumPct);
    rgbG = rgbStartG * 1 + parseInt((rgbEndG - rgbStartG) * thisNumPct);
    rgbB = rgbStartB * 1 + parseInt((rgbEndB - rgbStartB) * thisNumPct);
    return "rgb(" + rgbR + "," + rgbG + "," + rgbB + ")";
});