# 移动端通用开发框架（vue+vantui）

## 待解决问题

## 项目介绍

基于webpack的vue+vant-ui移动端开发模板

## 项目核心技术栈

### 基础框架

spa基础框架:vue2|vueRouter|vuex
打包构建工具:webpack5
js编译转码工具:babel7

### ui框架

[vant-ui](https://vant-contrib.gitee.io/vant/#/zh-CN/home)按需引入

### 移动端适配方案

+ 默认375px设计稿
+ DOM根元素fontSize设置为10vw
+ 应用postcss-pxtorem基准值设置为37.5
+ 开发中依据**375px**设计稿使用**px**单位进行设置
  
### 三方依赖

1. [qs](https://storm4542.github.io/archives/7b89c88d.html)

    + qs是用来解析和包装查询字符串的三方库
    + 使用方法

    ````javascript
        import qs from "qs";
        qs.stringfy({a:1,b:2});//包装
        qs.parse("a=1&b=2");//解析
    ```

2. [axios](http://www.axios-js.com/zh-cn/docs/)->请求库
3. [lodash](https://www.lodashjs.com/docs/latest)

    + lodash是javascript高效函数库
    + 项目中引入的是 lodash-es，引用方式采用ESM引用方式，能够应用webpack的tree shaking优化代码体积，按需加载方法
    + 使用方法

    ```javascript
        import {cloneDeep} from "lodash-es";
        cloneDeep({a:1})
    ```

4. [animate.css](https://animate.style/)->css3动画库

## 项目开发规范

### vant-ui 修改主题样式（less及自定义主题按需加载已经配置完成，无需再进行任何配置）

1. 打开[项目全局vant样式变量修改文件](\src\style\variable\vant-reset-variable.less)
2. 参考[vant官方组件变量配置文件](https://github.com/youzan/vant/blob/dev/src/style/var.less)在[项目全局vant样式变量修改文件](\src\less\variable\vant-reset-variable.less)中进行覆盖修改

### 请求

1. 请求使用**axios**三方请求工具
2. 针对axios进行了二次封装[request.js]((/src/util/request.js))
3. vue组件中应用`this.$request(...config)`进行请求
4. js中引入request.js进行请求或者引入vue，调用`vue.prototype.$request`

## 项目目录说明

|==build(webpack配置文件目录)|
|  webpack.prod.js(webpack生产环境配置文件)|
|  webpack.dev.js(webpack开发环境配置文件)|
|  webpack.base.js(webpack基础配置文件)|

|== .babel.config.js(babel配置文件)|
|   == components(组件目录)|
|   == config(项目基础配置目录)|
|== console(输出目录)|
|   == directive(自定义指令目录F)|
|== dist(打包输出目录)|
|   == filter(过滤器目录)|
|   == image(图片存放目录)|
|   == index.html|
|   == main.js(入口js)|
|   == mixin(Vue混入目录)|
|== node_modules|
|== package.json|
|== src(开发目录)|
|   == static(静态资源目录)|
|   == store(Vuex目录)|
|   == style(样式目录)|
|   == util(方法目录)|
