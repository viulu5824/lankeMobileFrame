const path = require('path');
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = merge(baseConfig, {
    output: {
        path: path.join(__dirname, '../dist'),
        filename: "js/[name].[contenthash:8].js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css"
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        // new LodashModuleReplacementPlugin(),
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
                test: /\.(le|c)ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../"
                    }
                }, "css-loader", "postcss-loader", "less-loader",
                {
                    loader: 'style-resources-loader',
                    options: {
                        patterns: path.join(__dirname, "../src/style/variable/variable.less"),
                    },
                }]
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 50000,
            minRemainingSize: 10240,
            maxSize: 1500000,
            minChunks: 2,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '.',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                common: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,//多进程提高构建速度
                extractComments: false,//去除注释
                terserOptions: {
                    compress: {
                        drop_console: false
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
    devtool: false,
});