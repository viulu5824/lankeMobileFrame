const path = require('path');
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.NODE_ENV;

module.exports = {
    entry: {
        main: [
            path.join(__dirname, '../src/main.js'),
        ]
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: "[name].js"
    },
    plugins: [
        new webpack.ProgressPlugin({ percentBy: 'entries' }),
        new htmlWebpackPlugin({
            template: path.join(__dirname, "../src/index.html"),
            filename: "index.html",
            minify: {
                collapseWhitespace: env != "development"
            }
            // favicon: './favicon.ico'
        }),
        new VueLoaderPlugin({
            verbose: true,
        }),
        new copyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname, "../src/static"),
                to: './static'
            }]
        }),
    ],
    module: {
        // noParse://,
        rules: [

            {
                test: /\.(le|c)ss$/,
                use: [env === "development" ? "style-loader" : {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../"
                    }
                }, "css-loader", "postcss-loader", {
                    loader: "less-loader",
                    options: {
                        lessOptions: {
                            modifyVars: {
                                hack: `true; @import "${path.join(__dirname, "../src/style/variable/vant-reset-variable.less")}";`,
                            }
                        }
                    }
                },
                {
                    loader: 'style-resources-loader',
                    options: {
                        patterns: path.join(__dirname, "../src/style/variable/variable.less"),
                    },
                }]
            },
            {
                test: /\.(ttf|woff2|svg|eot|svg|woff)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        outputPath: "font",
                        esModule: false
                    }
                }],
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                },
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        preserveWhitespace: false,
                        optimizeSSR: false
                    }
                }
            },
        ]
    },
    resolve: {
        //配置路径别名，便于快速引入文件
        alias: {
            /**
             * @description 开发公用
             */
            //src（开发文件夹） 文件夹
            "@": path.resolve(__dirname, "..src"),
            //componet（组件文件夹）
            "_c": path.resolve(__dirname, "../src/components"),
            //image（图片文件夹）
            "image": path.resolve(__dirname, "../src/image"),
            //static（静态文件文件夹）
            "static": path.resolve(__dirname, "../src/static"),
            //util（插件文件夹）
            "util": path.resolve(__dirname, "../src/util"),
            //api（公用接口文件夹）
            "api": path.resolve(__dirname, "../src/api"),
            //view（业务组件文件夹）
            "view": path.resolve(__dirname, "../src/components/view"),
            //mixin（vue混入文件夹）
            "mixin": path.resolve(__dirname, "../src/mixin"),
            //store（vuex配置文件）
            "store": path.resolve(__dirname, "../src/store/index.js"),
            //router（vueRouter配置文件）
            "router": path.resolve(__dirname, "../src/router/index.js"),
            //request（axios配置文件）
            "request": path.resolve(__dirname, "../src/axios/request.js"),
            //mount（vue注入配置文件）
            "mount": path.resolve(__dirname, "../src/mount/mount.js"),
            //verify（正则验证公用文件）
            "verify": path.resolve(__dirname, "../src/verify/verify.js"),
            //config 核心配置文件
            "config": path.resolve(__dirname, "../src/config/config.js"),
        },
        extensions: [".js", ".jsx", ".json"],
        modules: ["node_modules"]
    },
    target: "web"
}