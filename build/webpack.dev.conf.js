const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");
const env = process.env.NODE_ENV;
module.exports = merge(baseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(env)
            }
        }),
    ],
    mode: "development",
    devtool: 'cheap-module-source-map',
    devServer: {
        open: true,
        hot: true,
        // hotOnly: true,
        port: 5241,
        contentBase: "/",
        compress: true,
        host: "0.0.0.0",//外网访问
        host: "127.0.0.1",
        // https: true,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: '',
                pathRewrite: { '^/api': '' }
            },
        }
    }
})