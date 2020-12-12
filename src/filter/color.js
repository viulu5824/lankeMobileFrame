import Vue from "vue";

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