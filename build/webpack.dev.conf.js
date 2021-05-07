const path = require('path');
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");
const env = process.env.NODE_ENV;
console.log(env);
module.exports = merge(baseConfig, {
    output: {
        publicPath: './',
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     "process.env": {
        //         NODE_ENV: JSON.stringify(env)
        //     }
        // }),
    ],
    module: {
        rules: [

            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 7631,
                        name: "[name].[ext]",
                        outputPath: "image",
                        esModule: false
                    }
                }]
            },
        ]
    },
    mode: "development",
    devtool: 'cheap-module-source-map',
    devServer: {
        open: true,
        hot: true,
        // hotOnly: true,
        port: 5966,
        contentBase: "/",
        compress: true,
        host: "0.0.0.0",//外网访问
        host: "localhost",
        // https: true,
        historyApiFallback: true,
        proxy: {
            // 一标三实项目接口配置项
            "/api": {
                target: "http://192.168.66.110:80/",//刘源兴
                target: "http://192.168.66.79:82/",//刘宇宣
                target: "https://yqfk.shimingbao.net:18980/",//测试环境
                pathRewrite: { "^/api": "" },
                //不保留主机来源
                // changeOrigin: true,
            },
            // 疫情项目接口配置项
            "/fuseApi": {
                target: "http://192.168.66.79:85/",//刘宇宣
                target: "https://yqfk.shimingbao.net:6443/",//测试环境
                target: "http://192.168.66.110:81/",//刘源兴
                pathRewrite: { "^/fuseApi": "" }
            },
            // 户政配置项
            "/bladeXApi": {
                target: "http://192.168.66.79:85/",//刘宇宣
                target: "https://yqfk.shimingbao.net:6443/",//测试环境
                target: "http://124.70.8.169:9696/",//王春雨
                target: "http://192.168.66.110:80/",//刘源兴
                target: "http://192.168.66.100/",//王春雨   
                pathRewrite: { "^/bladeXApi": "" }
            },
            // 隔离点配置项
            "/isolationApi": {
                target: "http://192.168.66.79:85/",//刘宇宣
                target: "http://124.70.8.169:9696/",//王春雨
                target: "https://yqzwapi.lankecloud.com:18980/",//正式环境 
                target: "https://cshz.shimingbao.net:9500/",//测试环境
                target: "http://192.168.66.110:80/",//刘源兴  
                target: "http://192.168.66.100:81/",//王春雨  
                pathRewrite: { "^/isolationApi": "" }
            },
        }
    }
})