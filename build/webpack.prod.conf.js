const path = require('path');
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const env = process.env.NODE_ENV;
/**
 * 
 * @param {Object} env 
 * @param {Object} env.server 对应服务器 test测试服务器|formal正式服务器
 * @returns {Object} config
 */
module.exports = (env) => {
    return merge(baseConfig, {
        output: {
            path: path.join(__dirname, '../dist'),
            filename: "js/[name].[chunkhash:8].js",
            publicPath: '/wisdomCzPage/',
            pathinfo: false,
        },
        plugins: [
            new CleanWebpackPlugin.CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash:8].css"
            }),
            // new webpack.DefinePlugin({
            //     "process.env": {
            //         NODE_ENV: JSON.stringify(env)
            //     }
            // }),
            new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(js|css)$'),
                threshold: 10240,
                minRatio: 0.8
            }),

        ],
        module: {
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
            ]
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    parallel: true,
                    terserOptions: {
                        compress: {
                            drop_console: env === "production",
                            drop_debugger: env === "production",
                        },
                        format: {
                            comments: false
                        }
                    },
                }),
                new CssMinimizerPlugin({})
            ],
            minimize: true,
        },
        mode: "production",
        // devtool: env === "production" ? false : "eval-cheap-module-source-map",
    })
};