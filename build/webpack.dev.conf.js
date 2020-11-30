const path = require('path');
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");
module.exports = merge(baseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.ProgressPlugin({ percentBy: 'entries' })
    ],
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: ["style-loader", "css-loader", "postcss-loader", {
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
        ]
    },
    mode: "development",
    devtool: 'cheap-module-source-map',
    devServer: {
        open: true,
        hot: true,
        // hotOnly: true,
        port: 5866,
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