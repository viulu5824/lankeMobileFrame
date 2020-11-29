# 移动端通用开发框架（vue+vantui）

## 待解决问题

## 项目介绍

基于webpack的vue+vant-ui移动端开发模板

## 项目核心技术栈

- 基础框架
spa基础框架:vue2|vueRouter|vuex
打包构建工具:webpack5
js编译转码工具:babel7

- ui框架
[vant-ui](https://vant-contrib.gitee.io/vant/#/zh-CN/home)按需引入

- 移动端适配方案
   + 默认750px设计稿
   + DOM根元素fontSize设置为10vw
   + 应用postcss-pxtorem基准值设置为37.5
   
- 三方依赖
  1. [qs](https://storm4542.github.io/archives/7b89c88d.html)->queryString转换
  2. [axios](http://www.axios-js.com/zh-cn/docs/)->请求库
  3. [lodash](https://www.lodashjs.com/docs/latest)->javascript高效函数库
  4. [gsap](https://www.tweenmax.com.cn/)->javascript动画库
  5. [animate.css](https://animate.style/)->css3动画库

## 项目开发规范

- vant-ui 修改主题样式（less及自定义主题按需加载已经配置完成，无需再进行任何配置）
  1. 打开[项目全局vant样式变量修改文件](\src\less\variable\vant-reset-variable.less)
  2. 参考[vant官方组件变量配置文件](https://github.com/youzan/vant/blob/dev/src/style/var.less)在[项目全局vant样式变量修改文件](\src\less\variable\vant-reset-variable.less)中进行覆盖修改
