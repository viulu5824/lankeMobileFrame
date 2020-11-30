const path = require('path');
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
let baseConfig = {
    entry: {
        main: [
            path.join(__dirname, '../src/main.js'),
        ]
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: "[name].js",
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, "../src/index.html"),
            filename: "index.html",
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

        new BundleAnalyzerPlugin({
            analyzerMode:"json",
            generateStatsFile:true
        })
    ],
    module: {
        // noParse://,
        rules: [
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 7631,
                        name: "[hash:8]-[name].[ext]",
                        outputPath: "image",
                        esModule: false
                    }
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
                exclude: /(node_modules|bower_components)/,
                include: /(src|static)/
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
        alias: {
            "@": path.resolve(__dirname, "..src"),
            "_c": path.resolve(__dirname, "../src/components"),
            "static": path.resolve(__dirname, "../src/static"),
            webworkify: 'webworkify-webpack-dropin'
        },
        extensions: [".js", ".jsx", ".json"]
    },
    target: "web"
}
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    baseConfig.plugins.push(new CleanWebpackPlugin.CleanWebpackPlugin());
}
module.exports = baseConfig;