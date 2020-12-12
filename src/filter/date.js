import Vue from "vue";

//时间格式化过滤器
Vue.filter("yyyyMMddhhmmss", (value = new Date(), dateSeparator = "-", timeSeparator = ":") => {
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
Vue.filter("yyyyMMdd", (value = new Date(), dateSeparator = "-") => {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let dd = date.getDate();
    dd = dd < 10 ? ('0' + dd) : dd;
    return y + dateSeparator + MM + dateSeparator + dd;
});
Vue.filter("yyyyMM", (value = new Date(), dateSeparator = "-") => {
    let date = new Date(value);
    let yyyy = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let dd = date.getDate();
    dd = dd < 10 ? ('0' + dd) : dd;
    return yyyy + dateSeparator + MM;
});
Vue.filter("hhmmss", (value = new Date(), timeSeparator = ":") => {
    let date = new Date(value);
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return h + timeSeparator + m + timeSeparator + s;
});