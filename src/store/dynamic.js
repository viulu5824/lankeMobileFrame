export default {
    //用户基础信息
    isGetUserData: false,
    basicData: {},
    //环境信息
    env: process.env.NODE_ENV,
    //上一路由信息
    lastEmptyRoute: null,
    //当前路由信息
    currentRoute: {},
    //是否获取到微信签名
    isGetWxSign: false,
    //常用BOM
    href: location.href.split("#")[0],
    ua: navigator.userAgent,
    referrer: document.referrer || "",

    //沧州区县数据列表
    czAreaList: [],
}