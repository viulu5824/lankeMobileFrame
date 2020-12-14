const path = require('path');
const env = process.env.NODE_ENV;
const htmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
let baseConfig = {
    entry: {
        main: [
            path.join(__dirname, '../src/main.js'),
            "@babel/polyfill"
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
            analyzerMode: "disabled",
            generateStatsFile: true,
            statsFilename: path.join(__dirname, "../console/stats.json")
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
            "image": path.resolve(__dirname, "../src/image"),
            "static": path.resolve(__dirname, "../src/static"),
        },
        extensions: [".js", ".jsx", ".json"]
    },
    target: "browserslist"
}
if (env === "production" || env === "test") {
    baseConfig.plugins.push(new CleanWebpackPlugin.CleanWebpackPlugin());
}
module.exports = baseConfig;